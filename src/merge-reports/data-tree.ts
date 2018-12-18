import path from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import fsExtra from 'fs-extra';

import { isSkippedStatus, findNode, setStatusForBranch } from '../common-utils';
import { getDataFrom, getStatNameForStatus, getImagePaths } from './utils';
import { IImageInfo, ITest, IBrowser, ISuite, IData, IDataCollection } from './types';
import { ISkip } from '../test-result/types';

const fs = Promise.promisifyAll(fsExtra);

export default class DataTree {
  public static create(initialData: IData, destPath: string) {
    return new this(initialData, destPath);
  }

  private data: IData;
  private srcPath: string;
  private destPath: string;

  constructor(initialData: IData, destPath: string) {
    this.data = initialData;
    this.destPath = destPath;
  }

  public async mergeWith(dataCollection: IDataCollection) {
    // make it serially in order to perform correct merge/permutation of images and datas
    await Promise.each(_.toPairs(dataCollection), async ([srcPath, data]: [string, IData]) => {
      this.srcPath = srcPath;
      this.mergeSkips(data.skips);

      await this.mergeSuites(data.suites);
    });

    return this.data;
  }

  private mergeSkips(srcSkips: ISkip[]) {
    srcSkips.forEach((skip: ISkip) => {
      if (!_.find(this.data.skips, { suite: skip.suite, browser: skip.browser })) {
        this.data.skips.push(skip);
      }
    });
  }

  private async mergeSuites(srcSuites: ISuite[]) {
    await Promise.map(srcSuites, async (suite: ISuite) => {
      await this.mergeSuiteResult(suite);
    });
  }

  private async mergeSuiteResult(suite: ISuite) {
    const existentSuite: ISuite = findNode(this.data.suites, suite.suitePath);

    if (!existentSuite) {
      await this.addSuiteResult(suite);
      return;
    }

    if (suite.children) {
      await Promise.map(suite.children, (childSuite: ISuite) => this.mergeSuiteResult(childSuite));
    } else {
      await this.mergeBrowserResult(suite);
    }
  }

  private async mergeBrowserResult(suite: ISuite) {
    await Promise.map(suite.browsers, async (bro: IBrowser) => {
      const existentBro: IBrowser = this.findBrowserResult(suite.suitePath, bro.name);

      if (!existentBro) {
        await this.addBrowserResult(bro, suite.suitePath);
        return;
      }

      this.moveTestResultToRetries(existentBro);
      await this.addTestRetries(existentBro, bro.retries);
      await this.changeTestResult(existentBro, bro.result, suite.suitePath);
    });
  }

  private async addSuiteResult(suite: ISuite) {
    if (suite.suitePath.length === 1) {
      this.data.suites.push(suite);
    } else {
      const existentParentSuite: ISuite = findNode(this.data.suites, suite.suitePath.slice(0, -1));
      existentParentSuite.children.push(suite);
    }

    this.mergeStatistics(suite);
    await this.moveImages(suite, { fromFields: ['result', 'retries'] });
  }

  private async addBrowserResult(bro: IBrowser, suitePath: string[]) {
    const existentParentSuite: ISuite = findNode(this.data.suites, suitePath);
    existentParentSuite.browsers.push(bro);

    this.mergeStatistics(bro);
    await this.moveImages(bro, { fromFields: ['result', 'retries'] });
  }

  private moveTestResultToRetries(existentBro: IBrowser) {
    existentBro.retries.push(existentBro.result);

    this.data.retries += 1;
    const statName: string = getStatNameForStatus(existentBro.result.status);
    this.data[statName] -= 1;
  }

  private async addTestRetries(existentBro: IBrowser, retries: ITest[]) {
    await Promise.mapSeries(retries, (retry: ITest) => this.addTestRetry(existentBro, retry));
  }

  private async addTestRetry(existentBro: IBrowser, retry: ITest) {
    const newAttempt: number = existentBro.retries.length;

    await this.moveImages(retry, { newAttempt });
    const attemptedRetry = this.changeFieldsWithAttempt(retry, { newAttempt });

    existentBro.retries.push(attemptedRetry);
    this.data.retries += 1;
  }

  private async changeTestResult(existentBro: IBrowser, result: ITest, suitePath: string[]) {
    await this.moveImages(result, { newAttempt: existentBro.retries.length });
    existentBro.result = this.changeFieldsWithAttempt(
      result,
      { newAttempt: existentBro.retries.length },
    );

    const statName: string = getStatNameForStatus(existentBro.result.status);
    this.data[statName] += 1;

    if (!isSkippedStatus(existentBro.result.status)) {
      setStatusForBranch(this.data.suites, suitePath, existentBro.result.status);
    }
  }

  private mergeStatistics(node: (ISuite | IBrowser)) {
    const testResultStatuses: string[] = getDataFrom(
      node,
      { fieldName: 'status', fromFields: 'result' },
    );

    testResultStatuses.forEach((testStatus: string) => {
      const statName: string = getStatNameForStatus(testStatus);
      if (this.data.hasOwnProperty(statName)) {
        this.data.total += 1;
        this.data[statName] += 1;
      }
    });

    const testRetryStatuses: string[] = getDataFrom(
      node,
      { fieldName: 'status', fromFields: 'retries' },
    );
    this.data.retries += testRetryStatuses.length;
  }

  private async moveImages(
    node: (ITest | ISuite | IBrowser),
    { newAttempt, fromFields }: { newAttempt?: number, fromFields?: string[] },
  ) {
    await Promise.map(getImagePaths(node, fromFields), async (imgPath: any) => {
      const srcImgPath: string = path.resolve(this.srcPath, imgPath);
      const destImgPath: string = path.resolve(
        this.destPath,
        _.isNumber(newAttempt) ? imgPath.replace(/\d+(?=.png$)/, newAttempt) : imgPath,
      );

      await fs.move(srcImgPath, destImgPath, { overwrite: true });
    });
  }

  private changeFieldsWithAttempt(testResult: ITest, { newAttempt }: { newAttempt: number }) {
    const pathes: string[] = ['expectedPath', 'actualPath', 'diffPath'];
    const imagesInfo: IImageInfo[] = testResult.imagesInfo.map((imageInfo: IImageInfo) => {
      return _.mapValues(imageInfo, (val: any, key: any) => {
        return pathes.includes(key)
          ? val.replace(/\d+(?=.png)/, newAttempt)
          : val;
      });
    });

    return _.extend({}, testResult, { imagesInfo, attempt: newAttempt });
  }

  private findBrowserResult(suitePath: string[], browserId: string) {
    const existentNode = findNode(this.data.suites, suitePath);
    return _.find<IBrowser>(_.get(existentNode, 'browsers'), { name: browserId });
  }
}
