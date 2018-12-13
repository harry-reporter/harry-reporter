import { createSelector } from 'reselect';
import { TestsTypeKey } from 'src/store/modules/app/types';
import { formatSuitesData } from 'src/store/modules/tests/utils';
import { isFailedTest, isSuccessStatus } from 'src/utils';

import { Skip, Suite } from 'src/store/modules/tests/types';
import { RootStore } from 'src/store/types/store';

export const getSuites = ({ tests }: RootStore) => tests.tests;
export const getSkips = ({ tests }: RootStore) => tests.skips;
export const getFilterType = ({ app }: RootStore) => app.selectedTestsType;

export const getTestsByType = createSelector(
  [getSuites, getSkips, getFilterType],
  (suites: Suite[], skips: Skip[], type: TestsTypeKey): Suite[] => {

    switch (type) {
      case 'total':
        return formatSuitesData({ suites });

      case 'passed':
        return formatSuitesData({
          suites,
          filterSuites: (suite) => isSuccessStatus(suite.status),
        });

      case 'failed':
        return formatSuitesData({
          suites,
          filterSuites: (suite: Suite) => isFailedTest(suite),
        });

      case 'skipped':
        return formatSuitesData({ suites: skips });

      case 'retries':
        return formatSuitesData({
          suites,
          reduceBrowsers: (acc: Suite[], suite) => {
            const browsers = suite.browsers.filter((browser) => browser.result.attempt > 0);
            return [...acc, { ...suite, browsers }];
          },
        });

      default: return formatSuitesData({ suites });
    }
  },
);
