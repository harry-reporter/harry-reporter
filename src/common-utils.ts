import testStatusesConstants from './constants/test-statuses';

const {SUCCESS, FAIL, ERROR, SKIPPED, UPDATED, IDLE} = testStatusesConstants;

export const isSuccessStatus = (status: string) => status === SUCCESS;
export const isFailStatus = (status: string) => status === FAIL;
export const isIdleStatus = (status: string) => status === IDLE;
export const isErroredStatus = (status: string) => status === ERROR;
export const isSkippedStatus = (status: string) => status === SKIPPED;
export const isUpdatedStatus = (status: string) => status === UPDATED;
