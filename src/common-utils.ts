import {SUCCESS, FAIL, ERROR, SKIPPED, UPDATED, IDLE} from './constants/test-statuses';

export const isSuccessStatus = (status: string): boolean => status === SUCCESS;
export const isFailStatus = (status: string): boolean => status === FAIL;
export const isIdleStatus = (status: string): boolean => status === IDLE;
export const isErroredStatus = (status: string): boolean => status === ERROR;
export const isSkippedStatus = (status: string): boolean => status === SKIPPED;
export const isUpdatedStatus = (status: string): boolean => status === UPDATED;
