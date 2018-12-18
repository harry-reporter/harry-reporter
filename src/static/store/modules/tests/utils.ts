import { reduce, filter, map, assign, clone, cloneDeep, omit, isArray, get } from 'lodash';
import { isSuiteFailed, findNode, setStatusForBranch, walk } from '../utils';
import { isSkippedStatus } from '../../../../common-utils';
import { CompiledData, Suite, TestsStore, FormatSuitesDataArgs } from 'src/store/modules/tests/types';

const getSuiteId = (suite: Suite) => {
  return suite.suitePath[0];
};

const getSuiteIds = (suites: Suite[] = []) => {
  return map(suites, getSuiteId);
};

const getFailedSuiteIds = (suites) => {
  return getSuiteIds(filter(suites, isSuiteFailed));
};

export const formatSuitesDataTemp = (suites: Suite[] = []) => {
  return {
    suites: reduce(suites, (acc, s) => {
      acc[getSuiteId(s)] = s;
      return acc;
    }, {}),
    suiteIds: {
      all: getSuiteIds(suites),
      failed: getFailedSuiteIds(suites),
    },
  };
};

export const getInitialState = (compiledData: CompiledData): TestsStore => {
  const { config, skips, suites, total, passed, failed, skipped, retries, gui = false, running = false } = compiledData;

  return {
    config,
    gui,
    running,
    skips,
    ...formatSuitesDataTemp(suites),
    stats: {
      total,
      passed,
      failed,
      skipped,
      retries,
    },
  };
};

const enchanceUuid = (result) => {
  result.map((test, i) => {
    test.uuid = i;
    test.browsers.map((browser) => {
      browser.browsersId = `${test.uuid}${browser.name}`;
      browser.result.imagesInfo.map((view, index) => {
        view.viewId = `${test.uuid}${browser.name}result${index}`;
      });
      browser.retries.map((retry) => {
        retry.imagesInfo.map((view, index) => {
          view.viewId = `${test.uuid}${browser.name}retries${index}`;
        });
      });
    });
  });
  return result;
};

export const flatSuites = ({ suites = {}, filterSuites, filterBrowsers }: FormatSuitesDataArgs) => {
  const suiteList = [];

  for (const key in suites) {
    if (!suites.hasOwnProperty(key)) {
      continue;
    }

    let suite = suites[key];

    if (suite.children) {
      const children = flatSuites({ suites: suite.children, filterSuites, filterBrowsers });
      suiteList.push(...children);

      continue;
    }

    if (filterBrowsers) {
      const filteredBrowsers = suite.browsers.filter(filterBrowsers);
      if (filteredBrowsers.length === 0) {
        continue;
      }

      suite = { ...suite, browsers: filteredBrowsers };
    }

    if (filterSuites) {
      if (filterSuites(suite)) {
        suiteList.push(omit<Suite>(suite, ['children']));
      }

      continue;
    }

    suiteList.push(omit<Suite>(suite, ['children']));
  }

  return enchanceUuid(suiteList);
};

export const forceUpdateSuiteData = (suites, test) => {
  const id = getSuiteId(test);
  suites[id] = cloneDeep(suites[id]);
};

export const addTestResult = (state: TestsStore, action): TestsStore => {
  const suites = clone(state.suites);

  [].concat(action.payload).forEach((suite) => {
    const { suitePath, browserResult, browserId } = suite;
    const test = findNode(suites, suitePath);

    if (!test) {
      return;
    }

    test.browsers.forEach((b) => {
      if (b.name === browserId) {
        Object.assign(b, browserResult);
      }
    });
    setStatusForBranch(suites, suitePath, browserResult.result.status);
    forceUpdateSuiteData(suites, test);
  });

  const suiteIds = clone(state.suiteIds);
  assign(suiteIds, { failed: getFailedSuiteIds(suites) });

  return assign({}, state, { suiteIds, suites });
};

export const setStatusToAll = (node, status) => {
  if (isArray(node)) {
    node.forEach((n) => setStatusToAll(n, status));
  }

  const currentStatus = get(node, 'result.status', node.status);
  if (isSkippedStatus(currentStatus)) {
    return;
  }

  node.result
    ? (node.result.status = status)
    : node.status = status;

  return walk(node, (n) => setStatusToAll(n, status), Array.prototype.forEach);
};
