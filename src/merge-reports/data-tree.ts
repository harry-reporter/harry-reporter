import path from 'path';
import _ from 'lodash';
import BPromise from 'bluebird';
import fsExtra from 'fs-extra';

import {isSkippedStatus} from '../common-utils';
import {findNode, setStatusForBranch} from '../static/modules/utils';
import {getDataFrom, getStatNameForStatus, getImagePaths} from './utils';

const fs = BPromise.promisifyAll(fsExtra);

export default class DataTree {
  public static create(initialData: any, destPath: string) {
    return new this(initialData, destPath);
  }

  private data: any;
  private srcPath: string;
  private destPath: string;

  constructor(initialData: any, destPath: string) {
    this.data = initialData;
    this.destPath = destPath;
  }

  public async mergeWith(dataCollection: any) {
    // make it serially in order to perform correct merge/permutation of images and datas
    await BPromise.each(_.toPairs(dataCollection), async ([srcPath, data]: [string, any]) => {
      this.srcPath = srcPath;
      this.mergeSkips(data.skips);

      await this.mergeSuites(data.suites);
    });

    return this.data;
  }

  private mergeSkips(srcSkips: any) {
    srcSkips.forEach((skip: any) => {
      if (!_.find(this.data.skips, {suite: skip.suite, browser: skip.browser})) {
        this.data.skips.push(skip);
      }
    });
  }

  private async mergeSuites(srcSuites: any) {
    await BPromise.map(srcSuites, async (suite: any) => {
      await this.mergeSuiteResult(suite);
    });
  }

  private async mergeSuiteResult(suite: any) {
    const existentSuite = findNode(this.data.suites, suite.suitePath);

    if (!existentSuite) {
      await this.addSuiteResult(suite);
      return;
    }

    if (suite.children) {
      await BPromise.map(suite.children, (childSuite: any) => this.mergeSuiteResult(childSuite));
    } else {
      await this.mergeBrowserResult(suite);
    }
  }

  private async mergeBrowserResult(suite: any) {
    await BPromise.map(suite.browsers, async (bro: any) => {
      const existentBro = this.findBrowserResult(suite.suitePath, bro.name);

      if (!existentBro) {
        await this.addBrowserResult(bro, suite.suitePath);
        return;
      }

      this.moveTestResultToRetries(existentBro);
      await this.addTestRetries(existentBro, bro.retries);
      await this.changeTestResult(existentBro, bro.result, suite.suitePath);
    });
  }

  private async addSuiteResult(suite: any) {
    if (suite.suitePath.length === 1) {
      this.data.suites.push(suite);
    } else {
      const existentParentSuite = findNode(this.data.suites, suite.suitePath.slice(0, -1));
      existentParentSuite.children.push(suite);
    }

    this.mergeStatistics(suite);
    await this.moveImages(suite, {fromFields: ['result', 'retries']});
  }

  private async addBrowserResult(bro: any, suitePath: any) {
    const existentParentSuite = findNode(this.data.suites, suitePath);
    existentParentSuite.browsers.push(bro);

    this.mergeStatistics(bro);
    await this.moveImages(bro, {fromFields: ['result', 'retries']});
  }

  private moveTestResultToRetries(existentBro: any) {
    existentBro.retries.push(existentBro.result);

    this.data.retries += 1;
    const statName = getStatNameForStatus(existentBro.result.status);
    this.data[statName] -= 1;
  }

  private async addTestRetries(existentBro: any, retries: any) {
    await BPromise.mapSeries(retries, (retry: any) => this.addTestRetry(existentBro, retry));
  }

  private async addTestRetry(existentBro: any, retry: any) {
    const newAttempt = existentBro.retries.length;

    await this.moveImages(retry, {newAttempt});
    retry = this.changeFieldsWithAttempt(retry, {newAttempt});

    existentBro.retries.push(retry);
    this.data.retries += 1;
  }

  private async changeTestResult(existentBro: any, result: any, suitePath: any) {
    await this.moveImages(result, {newAttempt: existentBro.retries.length});
    existentBro.result = this.changeFieldsWithAttempt(result, {newAttempt: existentBro.retries.length});

    const statName = getStatNameForStatus(existentBro.result.status);
    this.data[statName] += 1;

    if (!isSkippedStatus(existentBro.result.status)) {
      setStatusForBranch(this.data.suites, suitePath, existentBro.result.status);
    }
  }

  private mergeStatistics(node: any) {
    const testResultStatuses = getDataFrom(node, {fieldName: 'status', fromFields: 'result'});

    testResultStatuses.forEach((testStatus: any) => {
      const statName = getStatNameForStatus(testStatus);
      if (this.data.hasOwnProperty(statName)) {
        this.data.total += 1;
        this.data[statName] += 1;
      }
    });

    const testRetryStatuses = getDataFrom(node, {fieldName: 'status', fromFields: 'retries'});
    this.data.retries += testRetryStatuses.length;
  }

  private async moveImages(node: any, {newAttempt, fromFields}: {newAttempt?: any, fromFields?: any}) {
    await BPromise.map(getImagePaths(node, fromFields), async (imgPath: any) => {
      const srcImgPath = path.resolve(this.srcPath, imgPath);
      const destImgPath = path.resolve(
        this.destPath,
        _.isNumber(newAttempt) ? imgPath.replace(/\d+(?=.png$)/, newAttempt) : imgPath,
      );

      await fs.move(srcImgPath, destImgPath, {overwrite: true});
    });
  }

  private changeFieldsWithAttempt(testResult: any, {newAttempt}: {newAttempt: any}) {
    const pathes: any = ['expectedPath', 'actualPath', 'diffPath'];
    const imagesInfo = testResult.imagesInfo.map((imageInfo: any) => {
      return _.mapValues(imageInfo, (val: string, key: string) => {
        return pathes.includes(key)
          ? val.replace(/\d+(?=.png)/, newAttempt)
          : val;
      });
    });

    return _.extend({}, testResult, {attempt: newAttempt, imagesInfo});
  }

  private findBrowserResult(suitePath: any, browserId: any) {
    const existentNode = findNode(this.data.suites, suitePath);
    return _.find(_.get(existentNode, 'browsers'), {name: browserId});
  }
}
