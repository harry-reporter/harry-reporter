import { filter, flatMap, set, cloneDeep, values, find } from 'lodash';
import { isFailStatus, isErroredStatus, isUpdatedStatus, isSuccessStatus } from '../../../common-utils';
import { Suite, Browser } from './tests/types';
import * as status from '../../../constants/test-statuses';

export const isSuiteFailed = (suite: Suite) => {
  return isFailStatus(suite.status) || isErroredStatus(suite.status);
};

export const isAcceptable = ({status, reason = ''}: any) => {
  const stack = reason && reason.stack;

  return isErroredStatus(status) && stack.startsWith('NoRefImageError') || isFailStatus(status);
};

export const filterBrowsers = (suites: Suite[] = [], filterFn) => {
  const modifySuite = (suite) => {
    if (suite.children) {
      return flatMap(suite.children, modifySuite);
    }

    return set(suite, 'browsers', filter(suite.browsers, (bro) => {
      if (suite.browserId && suite.browserId !== bro.name) {
        return false;
      }

      const browserResult = getBrowserResultByAttempt(bro, suite.acceptTestAttempt);

      return filterFn(browserResult);
    }));
  };

  return flatMap(cloneDeep(suites), modifySuite);
};

export const formatTests = (test) => {
  if (test.children) {
    return flatMap(test.children, formatTests);
  }

  if (test.browserId) {
    test.browsers = filter(test.browsers, { name: test.browserId });
  }

  const { suitePath, name, acceptTestAttempt } = test;
  const prepareImages = (images, filterCond) => {
    return filter(images, filterCond)
      .filter(isAcceptable)
      .map(({ actualPath, stateName }: any) => ({ status: status.UPDATED, actualPath, stateName }));
  };

  return flatMap(test.browsers, (browser) => {
    const browserResult = getBrowserResultByAttempt(browser, acceptTestAttempt);

    const imagesInfo = test.stateName
      ? prepareImages(browserResult.imagesInfo, { stateName: test.stateName })
      : prepareImages(browserResult.imagesInfo, 'actualPath');

    const { metaInfo, attempt } = browserResult;

    return imagesInfo.length && {
      suite: { path: suitePath.slice(0, -1) },
      state: { name },
      browserId: browser.name,
      metaInfo,
      imagesInfo,
      attempt,
    };
  });
};

export const filterFailedBrowsers = (suites: Suite[] = []) => {
  return filterBrowsers(suites, isSuiteFailed);
};

export const filterAcceptableBrowsers = (suites: Suite[] = []) => {
  return filterBrowsers(suites, isAcceptable);
};

const getBrowserResultByAttempt = (browser: Browser, attempt: number) => {
  return attempt >= 0
    ? browser.retries.concat(browser.result)[attempt]
    : browser.result;
};

export const findNode = (node, suitePath: string[]) => {
  suitePath = suitePath.slice();
  if (!node.children) {
      node = values(node);
      const tree = {
          name: 'root',
          children: node,
      };
      return findNode(tree, suitePath);
  }

  const pathPart = suitePath.shift();
  const child = find(node.children, {name: pathPart});

  if (!child) {
      return;
  }

  if (child.name === pathPart && !suitePath.length) {
      return child;
  }

  return findNode(child, suitePath);
};

export const setStatusForBranch = (nodes, suitePath: string[], status: string) => {
  const node = findNode(nodes, suitePath);
  if (!node) {
      return;
  }

  if ((isSuccessStatus(status) || isUpdatedStatus(status)) && hasFails(node)) {
      return;
  }

  node.status = status;
  suitePath = suitePath.slice(0, -1);
  setStatusForBranch(nodes, suitePath, status);
};

const hasFails = (node) => {
  const {result} = node;
  const isFailed = result && hasFailedImages(result);

  return isFailed || walk(node, hasFails);
};

export const walk = (node, cb, fn: any = Array.prototype.some) => {
  return node.browsers && fn.call(node.browsers, cb) || node.children && fn.call(node.children, cb);
};

const hasFailedImages = (result) => {
  const {imagesInfo = [], status: resultStatus} = result;

  return imagesInfo.some(({status}) => isErroredStatus(status) || isFailStatus(status))
      || isErroredStatus(resultStatus) || isFailStatus(resultStatus);
};
