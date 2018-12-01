import crypto from 'crypto';
import _ from 'lodash';
import { findNode } from '../../static/modules/utils';

const formatTestHandler = (browser: any, test: any) => {
  const { suitePath, name } = test;

  return {
    browserId: browser.name,
    state: { name },
    suite: { path: suitePath.slice(0, -1) },
  };
};

export const formatTests = (test: any) => {
  if (test.children) {
    return _.flatMap(test.children, (child) => exports.formatTests(child));
  }

  if (test.browserId) {
    test.browsers = _.filter(test.browsers, { name: test.browserId });
  }

  return _.flatMap(test.browsers, (browser) => formatTestHandler(browser, test));
};

export const findTestResult = (suites: any[] = [], test: any) => {
  const { name, suitePath, browserId } = test;
  const nodeResult = findNode(suites, suitePath);
  const browserResult = _.find(nodeResult.browsers, { name: browserId });

  return { name, suitePath, browserId, browserResult };
};

export const formatId = (hash: string, browserId: string) => `${hash}/${browserId}`;

export const getShortMD5 = (str: string) => {
    return crypto.createHash('md5').update(str, 'ascii').digest('hex').substr(0, 7);
};

export const mkFullTitle = ({suite, state}: any) => {
    // https://github.com/mochajs/mocha/blob/v2.4.5/lib/runnable.js#L165
    return `${suite.path.join(' ')} ${state.name}`;
};
