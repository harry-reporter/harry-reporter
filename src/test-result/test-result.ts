import _ from 'lodash';

import { ERROR, FAIL, SUCCESS } from '../constants/test-statuses';
import { getHermioneUtils } from '../plugin-utils';
import { getImagesFor } from '../server-utils';

const { getSuitePath } = getHermioneUtils();

import { ITestResult } from '../report-builder/types';
import Suite from '../suite/suite';
import { IHermione } from '../types';

export default class TestResult {
  private testResult: ITestResult;
  private hermione: IHermione;
  private errors: any;
  private suite: Suite;

  constructor(testResult: ITestResult, hermione: IHermione) {
      this.testResult = testResult;
      this.hermione = hermione;
      this.errors = this.hermione.errors;
      this.suite = new Suite(this.testResult);
  }

  get getSuite(): Suite {
      return this.suite;
  }

  get sessionId() {
      return this.testResult.sessionId || 'unknown session id';
  }

  get browserId() {
      return this.testResult.browserId;
  }

  get imagesInfo() {
      return this.testResult.imagesInfo;
  }

  set imagesInfo(imagesInfo) {
      this.testResult.imagesInfo = imagesInfo;
  }

  public hasDiff() {
    return this.assertViewResults.some((result: any) => this.isImageDiffError(result));
  }

  get assertViewResults() {
    return this.testResult.assertViewResults || [];
  }

  public isImageDiffError(assertResult: any) {
    return assertResult instanceof this.errors.ImageDiffError;
  }

  public isNoRefImageError(assertResult: any) {
    return assertResult instanceof this.errors.NoRefImageError;
  }

  public getImagesInfo() {
    if (!_.isEmpty(this.imagesInfo)) {
      return this.imagesInfo;
    }

    this.imagesInfo = this.assertViewResults.map((assertResult: any) => {
      let status: string;
      let reason: Pick<any, 'message' | 'stack'>;

      if (!(assertResult instanceof Error)) {
        status = SUCCESS;
      }

      if (this.isImageDiffError(assertResult)) {
        status = FAIL;
      }

      if (this.isNoRefImageError(assertResult)) {
        status = ERROR;
        reason = _.pick(assertResult, ['message', 'stack']);
      }

      const {stateName, refImg} = assertResult;

      return _.extend({stateName, refImg, status, reason}, getImagesFor(status, this, stateName));
    });

    // common screenshot on test fail
    if (this.screenshot) {
      const errorImage = _.extend(
        {status: ERROR, reason: this.error},
        getImagesFor(ERROR, this),
      );

      this.imagesInfo.push(errorImage);
    }

    return this.imagesInfo;
  }

  // hack which should be removed when html-reporter is able to show all assert view fails for one test
  private get firstAssertViewFail() {
    return _.find(this.testResult.assertViewResults, (result) => result instanceof Error);
  }

  get error() {
    return _.pick(this.testResult.err, ['message', 'stack', 'stateName']);
  }

  get imageDir() {
    return this.testResult.id();
  }

  get state() {
    return {name: this.testResult.title};
  }

  get attempt() {
    if (this.testResult.attempt >= 0) {
      return this.testResult.attempt;
    }

    const { retry } = this.hermione.config.forBrowser(this.testResult.browserId);
    return this.testResult.retriesLeft >= 0
      ? retry - this.testResult.retriesLeft - 1
      : retry;
  }

  // for correct determine image paths in gui
  set attempt(attemptNum) {
    this.testResult.attempt = attemptNum;
  }

  get screenshot() {
    return _.get(this.testResult, 'err.screenshot');
  }

  get assertViewState() {
    return this.firstAssertViewFail
      ? _.get(this.firstAssertViewFail, 'stateName')
      : _.get(this.testResult, 'err.stateName');
  }

  get description() {
    return this.testResult.description;
  }

  get meta() {
    return this.testResult.meta;
  }

  public getRefImg(stateName?: string) {
    return _.get(_.find(this.assertViewResults, {stateName}), 'refImg', {});
  }

  public getCurrImg(stateName: string) {
    return _.get(_.find(this.assertViewResults, {stateName}), 'currImg', {});
  }

  public getErrImg() {
    return this.screenshot || {};
  }

  public prepareTestResult() {
    const { title: name, browserId } = this.testResult;
    const suitePath = getSuitePath(this.testResult);

    return {name, suitePath, browserId};
  }

  get multipleTabs() {
    return true;
  }
}
