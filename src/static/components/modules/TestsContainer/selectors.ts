import { createSelector } from 'reselect';
import { TestsTypeKey } from 'src/store/modules/app/types';
import { formatSuitesData } from 'src/store/modules/tests/utils';
import { isFailedTest, isSuccessStatus } from 'src/utils';

import { Skip, Suite, SuiteIds, Suites } from 'src/store/modules/tests/types';
import { RootStore } from 'src/store/types/store';

export const getSuites = ({ tests }: RootStore) => tests.suites;
export const getSuiteIds = ({ tests }: RootStore) => tests.suiteIds;
export const getSkips = ({ tests }: RootStore) => tests.skips;
export const getFilterType = ({ app }: RootStore) => app.selectedTestsType;

export const getTestsByType = createSelector(
  [getSuites, getSuiteIds, getSkips, getFilterType],
  (suites: Suites, suiteIds: SuiteIds, skips: Skip[], type: TestsTypeKey): Suite[] => {

    switch (type) {
      case 'total':
        return formatSuitesData({ suites, suiteIds: suiteIds.all });

      case 'passed':
        return formatSuitesData({
          suites,
          suiteIds: suiteIds.all,
          filterSuites: (suite) => isSuccessStatus(suite.status),
        });

      case 'failed':
        return formatSuitesData({
          suites,
          suiteIds: suiteIds.failed,
          filterSuites: (suite: Suite) => isFailedTest(suite),
        });

      case 'skipped':
        return skips;

      case 'retries':
        return formatSuitesData({
          suites,
          suiteIds: suiteIds.all,
          reduceBrowsers: (acc: Suite[], suite) => {
            const browsers = suite.browsers.filter((browser) => browser.result.attempt > 0);
            return [...acc, { ...suite, browsers }];
          },
        });

      default: return formatSuitesData({ suites, suiteIds: suiteIds.all });
    }
  },
);
