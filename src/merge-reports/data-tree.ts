import path from 'path';
import _ from 'lodash';
import BPromise from 'bluebird';
import fsExtra from 'fs-extra';

import {isSkippedStatus} from '../common-utils';
import {findNode, setStatusForBranch} from '../static/modules/utils';
import {getDataFrom, getStatNameForStatus, getImagePaths} from './utils';

const fs = BPromise.promisifyAll(fsExtra);

export default class DataTree {
  public static create(initialData: any, destPath: any) {
    return new DataTree(initialData, destPath);
  }

  private _data: any;
  private _srcPath: any;
  private _destPath: any;

  constructor(initialData: any, destPath: any) {
    this._data = initialData;
    this._destPath = destPath;
  }

  public async mergeWith(dataCollection: any) {
    // make it serially in order to perform correct merge/permutation of images and datas
    await BPromise.each(_.toPairs(dataCollection), async ([srcPath, data]: [any, any]) => {
      this._srcPath = srcPath;
      this._mergeSkips(data.skips);

      await this._mergeSuites(data.suites);
    });

    return this._data;
  }

  private _mergeSkips(srcSkips: any) {
    srcSkips.forEach((skip: any) => {
      if (!_.find(this._data.skips, {suite: skip.suite, browser: skip.browser})) {
        this._data.skips.push(skip);
      }
    });
  }

  private async _mergeSuites(srcSuites: any) {
    await BPromise.map(srcSuites, async (suite: any) => {
      await this._mergeSuiteResult(suite);
    });
  }

  private async _mergeSuiteResult(suite: any) {
    const existentSuite = findNode(this._data.suites, suite.suitePath);

    if (!existentSuite) {
      await this._addSuiteResult(suite);
      return;
    }

    if (suite.children) {
      await BPromise.map(suite.children, (childSuite: any) => this._mergeSuiteResult(childSuite));
    } else {
      await this._mergeBrowserResult(suite);
    }
  }

  private async _mergeBrowserResult(suite: any) {
    await BPromise.map(suite.browsers, async (bro: any) => {
      const existentBro = this._findBrowserResult(suite.suitePath, bro.name);

      if (!existentBro) {
        await this._addBrowserResult(bro, suite.suitePath);
        return;
      }

      this._moveTestResultToRetries(existentBro);
      await this._addTestRetries(existentBro, bro.retries);
      await this._changeTestResult(existentBro, bro.result, suite.suitePath);
    });
  }

  private async _addSuiteResult(suite: any) {
    if (suite.suitePath.length === 1) {
      this._data.suites.push(suite);
    } else {
      const existentParentSuite = findNode(this._data.suites, suite.suitePath.slice(0, -1));
      existentParentSuite.children.push(suite);
    }

    this._mergeStatistics(suite);
    await this._moveImages(suite, {fromFields: ['result', 'retries']});
  }

  private async _addBrowserResult(bro: any, suitePath: any) {
    const existentParentSuite = findNode(this._data.suites, suitePath);
    existentParentSuite.browsers.push(bro);

    this._mergeStatistics(bro);
    await this._moveImages(bro, {fromFields: ['result', 'retries']});
  }

  private _moveTestResultToRetries(existentBro: any) {
    existentBro.retries.push(existentBro.result);

    this._data.retries += 1;
    const statName = getStatNameForStatus(existentBro.result.status);
    this._data[statName] -= 1;
  }

  private async _addTestRetries(existentBro: any, retries: any) {
    await BPromise.mapSeries(retries, (retry: any) => this._addTestRetry(existentBro, retry));
  }

  private async _addTestRetry(existentBro: any, retry: any) {
    const newAttempt = existentBro.retries.length;

    await this._moveImages(retry, {newAttempt});
    retry = this._changeFieldsWithAttempt(retry, {newAttempt});

    existentBro.retries.push(retry);
    this._data.retries += 1;
  }

  private async _changeTestResult(existentBro: any, result: any, suitePath: any) {
    await this._moveImages(result, {newAttempt: existentBro.retries.length});
    existentBro.result = this._changeFieldsWithAttempt(result, {newAttempt: existentBro.retries.length});

    const statName = getStatNameForStatus(existentBro.result.status);
    this._data[statName] += 1;

    if (!isSkippedStatus(existentBro.result.status)) {
      setStatusForBranch(this._data.suites, suitePath, existentBro.result.status);
    }
  }

  private _mergeStatistics(node: any) {
    const testResultStatuses = getDataFrom(node, {fieldName: 'status', fromFields: 'result'});

    testResultStatuses.forEach((testStatus: any) => {
      const statName = getStatNameForStatus(testStatus);
      if (this._data.hasOwnProperty(statName)) {
        this._data.total += 1;
        this._data[statName] += 1;
      }
    });

    const testRetryStatuses = getDataFrom(node, {fieldName: 'status', fromFields: 'retries'});
    this._data.retries += testRetryStatuses.length;
  }

  private async _moveImages(node: any, {newAttempt, fromFields}: {newAttempt?: any, fromFields?: any}) {
    await BPromise.map(getImagePaths(node, fromFields), async (imgPath: any) => {
      const srcImgPath = path.resolve(this._srcPath, imgPath);
      const destImgPath = path.resolve(
        this._destPath,
        _.isNumber(newAttempt) ? imgPath.replace(/\d+(?=.png$)/, newAttempt) : imgPath,
      );

      await fs.moveAsync(srcImgPath, destImgPath, {overwrite: true});
    });
  }

  private _changeFieldsWithAttempt(testResult: any, {newAttempt}: {newAttempt: any}) {
    const pathes: any = ['expectedPath', 'actualPath', 'diffPath'];
    const imagesInfo = testResult.imagesInfo.map((imageInfo: any) => {
      return _.mapValues(imageInfo, (val: any, key: any) => {
        return pathes.includes(key)
          ? val.replace(/\d+(?=.png)/, newAttempt)
          : val;
      });
    });

    return _.extend({}, testResult, {attempt: newAttempt, imagesInfo});
  }

  private _findBrowserResult(suitePath: any, browserId: any) {
    const existentNode = findNode(this._data.suites, suitePath);
    return _.find(_.get(existentNode, 'browsers'), {name: browserId});
  }
}
