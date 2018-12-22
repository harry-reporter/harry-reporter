import { createSelector } from 'reselect';
import { pick } from 'lodash';
import { TestsTypeKey } from 'src/store/modules/app/types';
import { flatSuites } from 'src/store/modules/tests/utils';
import { isFailedTest, isSuccessStatus, isSkippedStatus } from 'src/utils';

import { Browser, Suite, SuiteIds, Suites } from 'src/store/modules/tests/types';
import { RootStore } from 'src/store/types/store';

export const getSuites = ({ tests }: RootStore) => tests.suites;
export const getSuiteIds = ({ tests }: RootStore) => tests.suiteIds;
export const getFilterType = ({ app }: RootStore) => app.selectedTestsType;

export const getTestsByType = createSelector(
  [getSuites, getSuiteIds, getFilterType],
  (suites: Suites, suiteIds: SuiteIds, type: TestsTypeKey): Suite[] => {

    switch (type) {
      case 'total':
        return flatSuites({ suites });

      case 'passed':
        return flatSuites({
          suites: pick(suites, suiteIds.all),
          filterSuites: (suite) => isSuccessStatus(suite.status),
          filterBrowsers: (browser: Browser) => isSuccessStatus(browser.result.status),
        });

      case 'failed':
        return flatSuites({
          suites: pick(suites, suiteIds.failed),
          filterSuites: (suite: Suite) => isFailedTest(suite),
          filterBrowsers: (browser: Browser) => isFailedTest({ status: browser.result.status }),
        });

      case 'skipped':
        return flatSuites({
          suites: pick(suites, suiteIds.all),
          filterBrowsers: (browser: Browser) => isSkippedStatus(browser.result.status),
        });

      case 'retries':
        return flatSuites({
          suites: pick(suites, suiteIds.all),
          filterBrowsers: (browser: Browser) => browser.result.attempt > 0,
        });

      default: return flatSuites({ suites });
    }
  },
);
