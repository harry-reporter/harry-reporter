import Promise from 'bluebird';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';

import { ERROR, FAIL, IDLE, RUNNING, SKIPPED, SUCCESS, UPDATED } from '../constants/test-statuses';
import { getPathsFor, hasImage, logger, prepareCommonJSData } from '../server-utils';
import { hasFails, hasNoRefImageErrors, setStatusForBranch } from '../common-utils';
import TestResult from '../test-result/test-result';

import { IHermione, IPluginOpts } from '../types';
import { IHermioneStats, ITree, IHermioneResult } from './types';
import { ISkip, IChild, IResult, IProps, IImagesInfo } from '../test-result/types';

const NO_STATE = 'NO_STATE';

export default class ReportBuilder {
  private tree: ITree;
  private hermione: IHermione;
  private skips: ISkip[];
  private pluginConfig: IPluginOpts;
  private stats: any;

  constructor(hermione: IHermione, pluginConfig: IPluginOpts) {
    this.tree = { name: 'root' };
    this.skips = [];
    this.hermione = hermione;
    this.pluginConfig = pluginConfig;
  }

  public format(result: IHermioneResult): TestResult {
    return new TestResult(result, this.hermione);
  }

  public addIdle(result: IHermioneResult) {
    return this.addTestResult(this.format(result), { status: IDLE });
  }

  public addSkipped(result: IHermioneResult) {
    const formattedResult = this.format(result);
    const {
      suite: {
        skipComment: comment,
        fullName: suite,
      },
      browserId: browser,
    } = formattedResult;

    this.skips.push({ suite, browser, comment });

    return this.addTestResult(formattedResult, {
      reason: comment,
      status: SKIPPED,
    });
  }

  public addSuccess(result: IHermioneResult) {
    return this.addSuccessResult(this.format(result), SUCCESS);
  }

  public addFail(result: IHermioneResult) {
    return this.addFailResult(this.format(result));
  }

  public addError(result: IHermioneResult) {
    return this.addErrorResult(this.format(result));
  }

  public setStats(stats: IHermioneStats) {
    this.stats = stats;

    return this;
  }

  public addRetry(result: IHermioneResult) {
    const formattedResult = this.format(result);

    if (formattedResult.hasDiff()) {
      return this.addFailResult(formattedResult);
    } else {
      return this.addErrorResult(formattedResult);
    }
  }

  public save() {
    return this.saveDataFileAsync()
      .then(() => this.copyToReportDir(['index.html', 'report.min.js', 'report.min.css']))
      .then(() => this)
      .catch((e: Error) => logger.warn(e.message || e));
  }

  public saveDataFileAsync() {
    return fs.mkdirs(this.pluginConfig.path)
      .then(() => this.saveDataFile(fs.writeFile));
  }

  public saveDataFileSync() {
    fs.mkdirsSync(this.pluginConfig.path);
    this.saveDataFile(fs.writeFileSync);
  }

  public getSuites() {
    return this.tree.children;
  }

  public addUpdated(result: IHermioneResult) {
    const formattedResult = this.format(result);

    formattedResult.imagesInfo = (result.imagesInfo || []).map((imageInfo) => {
      const { stateName } = imageInfo;
      return _.extend(imageInfo, getPathsFor(UPDATED, formattedResult, stateName));
    });

    return this.addSuccessResult(formattedResult, UPDATED);
  }

  get reportPath() {
    return path.resolve(`${this.pluginConfig.path}/index.html`);
  }

  private getResult() {
    const { defaultView, baseHost, scaleImages, lazyLoadOffset } = this.pluginConfig;

    this.sortTree();

    return _.extend({
      config: { defaultView, baseHost, scaleImages, lazyLoadOffset },
      skips: _.uniq(this.skips),
      suites: this.tree.children,
    }, this.stats);
  }

  private addSuccessResult(formattedResult: any, status: any) {
    return this.addTestResult(formattedResult, { status });
  }

  private addFailResult(formattedResult: any) {
    return this.addTestResult(formattedResult, { status: FAIL });
  }

  private addErrorResult(formattedResult: any) {
    return this.addTestResult(formattedResult, {
      reason: formattedResult.error,
      status: ERROR,
    });
  }

  private createTestResult(result: TestResult, props: IProps): IResult {
    const {
      browserId,
      suite,
      sessionId,
      description,
      imagesInfo,
      screenshot,
      testBody,
      multipleTabs,
    } = result;
    const { baseHost } = this.pluginConfig;
    const suiteUrl = suite.getUrl({ baseHost });
    const metaInfo = _.merge(
      result.meta,
      {
        file: suite.file,
        sessionId,
        url: suite.fullUrl,
      });
    const testResult = {
      description,
      imagesInfo,
      metaInfo,
      multipleTabs,
      name: browserId,
      screenshot: Boolean(screenshot),
      suiteUrl,
      testBody,
    };

    return { ...testResult, ...props };
  }

  private addTestResult(formattedResult: TestResult, props: IProps) {
    const testResult = this.createTestResult(
      formattedResult,
      _.extend(props, { attempt: 0 }),
    );
    const { suite, browserId } = formattedResult;
    const suitePath = suite.path.concat(formattedResult.state
      ? formattedResult.state.name
      : NO_STATE,
    );
    const node = findOrCreate(this.tree, suitePath);
    node.browsers = Array.isArray(node.browsers) ? node.browsers : [];
    const existing = _.findIndex(node.browsers, { name: browserId });

    if (existing === -1) {
      formattedResult.attempt = testResult.attempt;
      formattedResult.image = hasImage(formattedResult);
      extendTestWithImagePaths(testResult, formattedResult);

      if (hasNoRefImageErrors(formattedResult)) {
        testResult.status = FAIL;
      }

      node.browsers.push({ name: browserId, result: testResult, retries: [] });
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

    const { imagesInfo, status: currentStatus } = stateInBrowser.result;
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

  let child = _.find<IChild>(node.children, { name: pathPart });

  if (!child) {
    child = {
      name: pathPart,
      suitePath: node.suitePath.concat(pathPart),
    };
    node.children.push(child);
  }

  return findOrCreate(child, statePath);
};

const extendTestWithImagePaths = (test: IResult, formattedResult: TestResult, oldImagesInfo: any = []) => {
  const newImagesInfo = formattedResult.getImagesInfo();

  if (test.status !== UPDATED) {
    return _.set(test, 'imagesInfo', newImagesInfo);
  }

  if (oldImagesInfo.length) {
    test.imagesInfo = oldImagesInfo;
    newImagesInfo.forEach((imageInfo: IImagesInfo) => {
      const { stateName } = imageInfo;
      const index = _.findIndex(test.imagesInfo, { stateName });

      test.imagesInfo[index >= 0 ? index : _.findLastIndex(test.imagesInfo)] = imageInfo;
    });
  }

  return test;
};
