import { reduce, filter, map, assign, clone, cloneDeep } from 'lodash';
import { isSuiteFailed, findNode, setStatusForBranch } from '../utils';
import { CompiledData, Suite, TestsStore } from 'src/store/modules/tests/types';

interface FormatSuitesDataArgs {
  suites: Suite[];
  filterSuites?: (suite: Suite) => boolean;
  reduceBrowsers?: (acc: Suite[], suite: Suite) => Suite[];
}

export const formatSuitesData = ({ suites = [], filterSuites, reduceBrowsers }: FormatSuitesDataArgs) => {
  return suites.reduce<Suite[]>((acc, suite) => {
    if (suite.children) {
      let children = filterSuites
        ? suite.children.filter(filterSuites)
        : suite.children;

      if (reduceBrowsers) {
        children = children.reduce(reduceBrowsers, []);
      }

      return [...acc, ...children];
    }

    return acc;
  }, []);
};

export const getInitialState = (compiledData: CompiledData): TestsStore => {
  const { skips, suites, total, passed, failed, skipped, retries, gui = false } = compiledData;

  return {
    gui,
    skips,
    tests: suites,
    stats: {
      total, passed, failed, skipped, retries,
    },
  };
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

const getFailedSuiteIds = (suites) => {
  return getSuiteIds(filter(suites, isSuiteFailed));
};

const getSuiteIds = (suites: Suite[] = []) => {
  return map(suites, getSuiteId);
};

const getSuiteId = (suite: Suite) => {
  return suite.suitePath[0];
};

export const addTestResult = (state: TestsStore, action): TestsStore => {
  const suites = clone(state.suites);

  [].concat(action.payload).forEach((suite) => {
      const {suitePath, browserResult, browserId} = suite;
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
  assign(suiteIds, {failed: getFailedSuiteIds(suites)});

  return assign({}, state, {suiteIds, suites});
};

const forceUpdateSuiteData = (suites, test) => {
  const id = getSuiteId(test);
  suites[id] = cloneDeep(suites[id]);
};
