import { filter, flatMap, set, cloneDeep, reduce, map } from 'lodash';
import { isFailStatus, isErroredStatus } from '../../../common-utils';

export const isSuiteFailed = (suite: any) => {
  return isFailStatus(suite.status) || isErroredStatus(suite.status);
};

export const isAcceptable = ({status, reason = ''}: any) => {
  const stack = reason && reason.stack;

  return isErroredStatus(status) && stack.startsWith('NoRefImageError') || isFailStatus(status);
};

export const filterBrowsers = (suites: any = [], filterFn: any) => {
  const modifySuite = (suite: any): any => {
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

export const formatTests = (test: any): any => {
  if (test.children) {
    return flatMap(test.children, formatTests);
  }

  if (test.browserId) {
    test.browsers = filter(test.browsers, { name: test.browserId });
  }

  const { suitePath, name, acceptTestAttempt } = test;
  const prepareImages = (images: any, filterCond: any) => {
    return filter(images, filterCond)
      .filter(isAcceptable)
      .map(({ actualPath, stateName }: any) => ({ status: 'updated', actualPath, stateName }));
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

export const filterFailedBrowsers = (suites: any = []) => {
  return filterBrowsers(suites, isSuiteFailed);
};

export const filterAcceptableBrowsers = (suites: any = []) => {
  return filterBrowsers(suites, isAcceptable);
};

const getBrowserResultByAttempt = (browser: any, attempt: any) => {
  return attempt >= 0
    ? browser.retries.concat(browser.result)[attempt]
    : browser.result;
};
