import { createSelector } from 'reselect';
import { pick } from 'lodash';
import { TestsTypeKey } from 'src/store/modules/app/types';
import { flatSuites } from 'src/store/modules/tests/utils';
import { isFailedTest, isSuccessStatus } from 'src/utils';

import { Browser, Skip, Suite, SuiteIds, Suites } from 'src/store/modules/tests/types';
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
        return flatSuites({ suites });

      case 'passed':
        return flatSuites({
          suites: pick(suites, suiteIds.all),
          filterSuites: (suite) => isSuccessStatus(suite.status),
        });

      case 'failed':
        return flatSuites({
          suites: pick(suites, suiteIds.failed),
          filterSuites: (suite: Suite) => isFailedTest(suite),
        });

      case 'skipped':
        return skips;

      case 'retries':
        return flatSuites({
          suites: pick(suites, suiteIds.all),
          filterBrowsers: (browser: Browser) => browser.result.attempt > 0,
        });

      default: return flatSuites({ suites });
    }
  },
);
