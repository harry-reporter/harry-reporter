import Promise from 'bluebird';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';

import { ERROR, FAIL, IDLE, RUNNING, SKIPPED, SUCCESS, UPDATED } from '../constants/test-statuses';
import { getImagesFor, hasImage, logger, prepareCommonJSData } from '../server-utils';
import { hasFails, hasNoRefImageErrors, setStatusForBranch } from '../static/modules/utils';
import TestResult from '../test-result/test-result';

import { IHermione, IPluginOpts } from '../types';
import { IChild, ISkip, ITestResult, ITree } from './types';

const NO_STATE = 'NO_STATE';

export default class ReportBuilder {
  private tree: ITree;
  private hermione: IHermione;
  private skips: ISkip[];
  private extraItems: object;
  private pluginConfig: IPluginOpts;
  private stats: any;

  constructor(hermone: IHermione, pluginConfig: IPluginOpts) {
    this.tree = {name: 'root'};
    this.skips = [];
    this.extraItems = {};
    this.pluginConfig = pluginConfig;
  }

  public format(result: any) {
    return new TestResult(result, this.hermione);
  }

  public addIdle(result: any) {
    return this.addTestResult(this.format(result), {status: IDLE});
  }

  public addSkipped(result: any) {
    const formattedResult = this.format(result);
    const {
      getSuite: {
        skipComment: comment,
        fullName: suite,
      },
      browserId: browser,
    } = formattedResult;

    this.skips.push({suite, browser, comment});

    return this.addTestResult(formattedResult, {
      reason: comment,
      status: SKIPPED,
    });
  }

  public addSuccess(result: any) {
    return this.addSuccessResult(this.format(result), SUCCESS);
  }

  public addUpdated(result: any) {
    const formattedResult = this.format(result);

    formattedResult.imagesInfo = (result.imagesInfo || []).map((imageInfo: any) => {
      const {stateName} = imageInfo;
      return _.extend(imageInfo, getImagesFor(UPDATED, formattedResult, stateName));
    });

    return this.addSuccessResult(formattedResult, UPDATED);
  }

  public addFail(result: any) {
    return this.addFailResult(this.format(result));
  }

  public addError(result: any) {
    return this.addErrorResult(this.format(result));
  }

  public addRetry(result: any) {
    const formattedResult = this.format(result);

    if (formattedResult.hasDiff()) {
      return this.addFailResult(formattedResult);
    } else {
      return this.addErrorResult(formattedResult);
    }
  }

  public setStats(stats: any) {
    this.stats = stats;

    return this;
  }

  public setExtraItems(extraItems: any) {
    this.extraItems = extraItems;

    return this;
  }

  public save() {
    return this.saveDataFileAsync()
      .then(() => this.copyToReportDir(['index.html', 'report.min.js', 'report.min.css']))
      .then(() => this)
      .catch((e: any) => logger.warn(e.message || e));
  }

  public saveDataFileAsync() {
    return fs.mkdirs(this.pluginConfig.path)
      .then(() => this.saveDataFile(fs.writeFile));
  }

  public saveDataFileSync() {
    fs.mkdirsSync(this.pluginConfig.path);
    this.saveDataFile(fs.writeFileSync);
  }

  public getResult() {
    const {defaultView, baseHost, scaleImages, lazyLoadOffset} = this.pluginConfig;

    this.sortTree();

    return _.extend({
      config: {defaultView, baseHost, scaleImages, lazyLoadOffset},
      extraItems: this.extraItems,
      skips: _.uniq(this.skips),
      suites: this.tree.children,
    }, this.stats);
  }

  public getSuites() {
    return this.tree.children;
  }

  private addSuccessResult(formattedResult: any, status: any) {
    return this.addTestResult(formattedResult, {status});
  }

  private addFailResult(formattedResult: any) {
    return this.addTestResult(formattedResult, {status: FAIL});
  }

  private addErrorResult(formattedResult: any) {
    return this.addTestResult(formattedResult, {
      reason: formattedResult.error,
      status: ERROR,
    });
  }

  private createTestResult(result: any, props: any): ITestResult {
    const {browserId, suite, sessionId, description, imagesInfo, screenshot, multipleTabs} = result;
    const {baseHost} = this.pluginConfig;
    const suiteUrl = suite.getUrl({browserId, baseHost});
    const metaInfo = _.merge(result.meta, {url: suite.fullUrl, file: suite.file, sessionId});
    const testResult = {
      description,
      imagesInfo,
      metaInfo,
      multipleTabs,
      name: browserId,
      screenshot: Boolean(screenshot),
      suiteUrl,
    };

    return { ...testResult, props };
  }

  private addTestResult(formattedResult: any, props: any) {
    const testResult = this.createTestResult(formattedResult, _.extend(props, {attempt: 0}));
    const {suite, browserId} = formattedResult;
    const suitePath = suite.path.concat(formattedResult.state ? formattedResult.state.name : NO_STATE);
    const node = findOrCreate(this.tree, suitePath);
    node.browsers = Array.isArray(node.browsers) ? node.browsers : [];
    const existing = _.findIndex(node.browsers, {name: browserId});

    if (existing === -1) {
      formattedResult.attempt = testResult.attempt;
      formattedResult.image = hasImage(formattedResult);
      extendTestWithImagePaths(testResult, formattedResult);

      if (hasNoRefImageErrors(formattedResult)) {
        testResult.status = FAIL;
      }

      node.browsers.push({name: browserId, result: testResult, retries: []});
      setStatusForBranch(this.tree, node.suitePath, testResult.status);

      return formattedResult;
    }

    const stateInBrowser = node.browsers[existing];
    const previousResult = _.cloneDeep(stateInBrowser.result);

    const statuses: string[] = [SKIPPED, RUNNING, IDLE];

    if (!statuses.includes(previousResult.status)) {
      testResult.attempt = testResult.status === UPDATED
        ? formattedResult.attempt
        : previousResult.attempt + 1;

      if (testResult.status !== UPDATED) {
        stateInBrowser.retries.push(previousResult);
      }
    }

    formattedResult.attempt = testResult.attempt;
    formattedResult.image = hasImage(formattedResult);

    const {imagesInfo, status: currentStatus} = stateInBrowser.result;
    stateInBrowser.result = extendTestWithImagePaths(testResult, formattedResult, imagesInfo);

    if (!hasFails(stateInBrowser)) {
      stateInBrowser.result.status = SUCCESS;
    } else if (hasNoRefImageErrors(stateInBrowser.result)) {
      stateInBrowser.result.status = FAIL;
    } else if (stateInBrowser.result.status === UPDATED) {
      stateInBrowser.result.status = currentStatus;
    }

    setStatusForBranch(this.tree, node.suitePath, testResult.status);

    return formattedResult;
  }

  private saveDataFile(saveFn: any) {
    return saveFn(
      path.join(this.pluginConfig.path, 'data.js'),
      prepareCommonJSData(this.getResult()),
      'utf8',
    );
  }

  private sortTree(node = this.tree) {
    if (node.children) {
      node.children = _.sortBy(node.children, 'name');
      node.children.forEach((n: any) => this.sortTree(n));
    }
  }

  private copyToReportDir(files: string[]) {
    return Promise.map(files, (fileName: string) => {
      const from = path.resolve(__dirname, '../static', fileName);
      const to = path.join(this.pluginConfig.path, fileName);

      return fs.copy(from, to);
    });
  }

  get reportPath() {
    return path.resolve(`${this.pluginConfig.path}/index.html`);
  }
}

const findOrCreate = (node: any, statePath: any): any => {
  if (statePath.length === 0) {
    return node;
  }

  node.children = Array.isArray(node.children) ? node.children : [];

  const pathPart = statePath.shift();
  node.suitePath = node.suitePath || [];

  if (pathPart === NO_STATE) {
    return node;
  }

  let child: IChild = _.find(node.children, {name: pathPart});

  if (!child) {
    child = {
      name: pathPart,
      suitePath: node.suitePath.concat(pathPart),
    };
    node.children.push(child);
  }

  return findOrCreate(child, statePath);
};

const extendTestWithImagePaths = (test: any, formattedResult: any, oldImagesInfo: any = []) => {
  const newImagesInfo = formattedResult.getImagesInfo(test.status);

  if (test.status !== UPDATED) {
    return _.set(test, 'imagesInfo', newImagesInfo);
  }

  if (oldImagesInfo.length) {
    test.imagesInfo = oldImagesInfo;
    newImagesInfo.forEach((imageInfo: any) => {
      const {stateName} = imageInfo;
      const index = _.findIndex(test.imagesInfo, {stateName});

      test.imagesInfo[index >= 0 ? index : _.findLastIndex(test.imagesInfo)] = imageInfo;
    });
  }

  return test;
};
