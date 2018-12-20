import { Attempt, Browser, Suite, TestStatus } from '../store/modules/tests/types';

export const isSuccessStatus = (status: TestStatus) => status === 'success';
export const isErroredStatus = (status: TestStatus) => status === 'error';
export const isFailedStatus = (status: TestStatus) => status === 'fail';
export const isIdleStatus = (status: TestStatus) => status === 'idle';
export const isSkippedStatus = (status: TestStatus) => status === 'skipped';

export const isFailedTest = (test: Suite | Attempt | { status: TestStatus }) => {
  return isFailedStatus(test.status) || isErroredStatus(test.status);
};

export const hasRetries = ({ browsers }: Suite): boolean => {
  return browsers.some((browser: Browser) => browser.result.attempt > 0);
};

export const getColorByStatus = (status: TestStatus) => {
  switch (status) {
    case 'success': return 'green';

    case 'fail':
    case 'error': return 'red';

    case 'running': return 'yellow';
    case 'skipped': return 'gray';

    default: return 'gray';
  }
};
