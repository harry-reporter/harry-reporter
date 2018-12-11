import { Attempt, Suite, TestStatus } from '../store/modules/tests/types';

export const isErroredStatus = (status: TestStatus) => status === 'error';
export const isFailedStatus = (status: TestStatus) => status === 'fail';

export const isFailedTest = (test: Suite | Attempt | { status: TestStatus }) => {
  return isFailedStatus(test.status) || isErroredStatus(test.status);
};
