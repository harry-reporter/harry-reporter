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

export const setIsOpenForTestBox = (isOpen: boolean, uuid: string) => ({
  type: actionNames.SET_IS_OPEN_FOR_TEST_BOX,
  payload: { isOpen, uuid },
});
export const setIsOpenForBrowser = (
  isOpenedBrowser: boolean,
  browsersId: string,
) => ({
  type: actionNames.SET_IS_OPEN_FOR_BROWSER,
  payload: { isOpenedBrowser, browsersId },
});
export const setIsOpenForView = (
  isOpenScreenView: boolean,
  screenViewId: string,
) => ({
  type: actionNames.SET_IS_OPEN_FOR_VIEW,
  payload: { isOpenScreenView, screenViewId },
});

export const setScreenModForView = (
  screenViewMod: string,
  screenViewModId: string,
) => ({
  type: actionNames.SET_SCREEN_FOR_VIEW,
  payload: { screenViewMod, screenViewModId },
});
