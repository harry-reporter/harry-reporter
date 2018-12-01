import _ from 'lodash';
import path from 'path';
import Uri from 'urijs';
import { default as urlLib } from 'url';
import { getHermioneUtils } from '../plugin-utils';

const { getSuitePath } = getHermioneUtils();

import { ITestResult } from '../report-builder/types';
import { IPluginOpts } from '../types';

export default class Suite {
  private suite: ITestResult;

  constructor(suite: ITestResult) {
    this.suite = suite;
  }

  get skipComment() {
    const skipComment = getSkipComment(this.suite);

    return this.wrapSkipComment(skipComment);
  }

  get fullName() {
    return this.suite.fullTitle();
  }

  get path() {
    return getSuitePath(this.suite.parent);
  }

  get file() {
    return path.relative(process.cwd(), this.suite.file);
  }

  public getUrl(opts?: IPluginOpts) {
    const url = _.get(this, '_suite.meta.url', '');

    return this.configureUrl(url, opts.baseHost);
  }

  get fullUrl() {
    const baseUrl = this.getUrl();

    return baseUrl
      ? urlLib.parse(baseUrl).path
      : '';
  }

  private wrapSkipComment(skipComment: string) {
    return skipComment ? wrapLinkByTag(skipComment) : 'Unknown reason';
  }

  private configureUrl(url: string, baseHost: string) {
    return _.isEmpty(baseHost)
      ? url
      : Uri(baseHost).resource(url).href();
  }
}

const getSkipComment = (suite: ITestResult): string => {
  return suite.skipReason || suite.parent && getSkipComment(suite.parent);
};

const wrapLinkByTag = (text: string) => {
  return text.replace(/https?:\/\/[^\s]*/g, (url: string) => {
    return `<a target="_blank" href="${url}">${url}</a>`;
  });
};
