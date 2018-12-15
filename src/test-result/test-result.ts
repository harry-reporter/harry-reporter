import _ from 'lodash';

import { ERROR, FAIL, SUCCESS } from '../constants/test-statuses';
import { getSuitePath } from '../plugin-utils';
import { getPathsFor } from '../server-utils';
import { IHermioneResult } from '../report-builder/types';
import { IHermione } from '../types';
import Suite from '../suite/suite';
import { IImagesInfo } from './types';

export default class TestResult {
  public actualPath: string;
  public currentPath: string;
  public image: boolean;
  public referencePath: string;
  private testResult: IHermioneResult;
  private hermione: IHermione;
  private errors: any;
  private suiteInternal: Suite;

  constructor(testResult: IHermioneResult, hermione: IHermione) {
    this.testResult = testResult;
    this.hermione = hermione;
    this.errors = hermione.errors;
    this.suiteInternal = new Suite(this.testResult);
  }

  get suite(): Suite {
    return this.suiteInternal;
  }

  get sessionId() {
    return this.testResult.sessionId || 'unknown session id';
  }

  get browserId() {
    return this.testResult.browserId;
  }

  get assertViewResults(): any[] { // TODO add type
    return this.testResult.assertViewResults || [];
  }

  get testBody(): string {
    return this.testResult.body;
  }

  get scenario(): any {
    const { hermioneCtx } = this.testResult;

    if (hermioneCtx && hermioneCtx.testpalm) {
      return hermioneCtx.testpalm.steps;
    }

    return null;
  }

  get imagesInfo(): IImagesInfo[] {
    return this.testResult.imagesInfo;
  }

  set imagesInfo(imagesInfo: IImagesInfo[]) {
    this.testResult.imagesInfo = imagesInfo;
  }

  public hasDiff() {
    return this.assertViewResults.some((result: any) =>
      this.isImageDiffError(result));
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

    this.imagesInfo = this.assertViewResults.map((assertResult: any): IImagesInfo => {
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

      const { stateName, refImg } = assertResult;

      return _.extend<IImagesInfo>(
        { stateName, refImg, status, reason },
        getPathsFor(status, this, stateName),
      );
    });

    // common screenshot on test fail
    if (this.screenshot) {
      const errorImage = _.extend<IImagesInfo>(
        { status: ERROR, reason: this.error },
        getPathsFor(ERROR, this),
      );

      this.imagesInfo.push(errorImage);
    }

    return this.imagesInfo;
  }

  // hack which should be removed when html-reporter is able to show all assert view fails for one test
  private get firstAssertViewFail() {
    return _.find(
      this.testResult.assertViewResults,
      (result) => result instanceof Error,
    );
  }

  get error() {
    return _.pick(this.testResult.err, ['message', 'stack', 'stateName']);
  }

  get imageDir() {
    return this.testResult.id();
  }

  get state() {
    return { name: this.testResult.title };
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

  public getImagePath(stateName?: string) {
    return _.find(this.imagesInfo, { stateName }).imagePath || undefined;
  }

  public prepareTestResult() {
    const { title: name, browserId } = this.testResult;
    const suitePath = getSuitePath(this.testResult);

    return { name, suitePath, browserId };
  }

  get multipleTabs() {
    return true;
  }
}
