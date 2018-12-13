import * as actionNames from './constants';
import { TestsViewMode, ScreenViewMode } from './types';

export const setTestsType = (type) => ({
  type: actionNames.SET_TESTS_TYPE,
  payload: type,
});
export const setUrl = (value: string) => ({
  type: actionNames.UPDATE_URL,
  payload: value,
});
export const setScreenViewMode = (value: ScreenViewMode) => ({
  type: actionNames.SET_SCREEN_VIEW_MODE,
  payload: value,
});
export const setTestsViewMode = (value: TestsViewMode) => ({
  type: actionNames.SET_TESTS_VIEW_MODE,
  payload: value,
});
