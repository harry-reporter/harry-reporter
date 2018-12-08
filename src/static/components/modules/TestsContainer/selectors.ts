import { Skip, Suite } from 'src/store/modules/tests/types';
import { TestsTypeKey } from 'src/store/modules/app/types';

export const getTestsByType = (tests: Suite[], skips: Skip[], type: TestsTypeKey): Suite[] => {
  switch (type) {
    case 'total': return tests;
    case 'passed': return tests.filter((test) => test.status === 'success');
    case 'failed': return tests.filter((test) => (test.status === 'fail') || (test.status === 'error'));
    case 'skipped': return skips;
    case 'retries': return tests.reduce((acc: Suite[], test) => {
      const browsers = test.browsers.filter((browser) => browser.result.attempt > 0);

      return [...acc, { ...test, browsers }];
    }, []);

    default: return tests;
  }
};
