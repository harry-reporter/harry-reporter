import { Skip, Suite } from 'src/store/modules/tests/types';
import { TestsTypeKey } from 'src/store/modules/app/types';
import { formatSuitesData } from 'src/store/modules/tests/utils';

export const getTestsByType = (suites: Suite[], skips: Skip[], type: TestsTypeKey): Suite[] => {
  switch (type) {
    case 'total':
      return formatSuitesData({ suites });

    case 'passed':
      return formatSuitesData({
        suites,
        filterSuites: (suite) => suite.status === 'success',
      });

    case 'failed':
      return formatSuitesData({
        suites,
        filterSuites: (test: Suite) => (test.status === 'fail') || (test.status === 'error'),
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
};
