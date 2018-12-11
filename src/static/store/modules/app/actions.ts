import { flatMap, compact } from 'lodash';
import * as actionNames from './constants';
import {
  filterFailedBrowsers,
  filterAcceptableBrowsers,
  formatTests,
} from '../../utils/utils';

export const setTestsType = (type) => ({
  type: actionNames.SET_TESTS_TYPE,
  payload: type,
});

export const initGui = () => {
  return async (dispatch) => {
    try {
      const appState = await fetch('/init').then((res) => res.json());
      dispatch({
        type: actionNames.INIT_GUI,
        payload: appState,
      });
    } catch (e) {
      // handle error
    }
  };
};

const runTests = ({ tests = [], action = {} } = {}) => {
  return async (dispatch) => {
    try {
      await fetch('/run', { method: 'POST', body: JSON.stringify(tests) });
      dispatch(action);
    } catch (e) {
      // handle error
    }
  };
};

export const runAllTests = () => {
  return runTests({
    action: { type: actionNames.RUN_ALL },
  });
};

export const runFailedTests = (fails, actionName = actionNames.RUN_FAILED) => {
  fails = filterFailedBrowsers([].concat(fails));

  return runTests({ tests: fails, action: { type: actionName } });
};

export const acceptAll = (fails) => {
  fails = filterAcceptableBrowsers([].concat(fails));

  const formattedFails = flatMap([].concat(fails), formatTests);

  return async (dispatch) => {
    try {
      const updatedData = await fetch('/update-reference', {
        method: 'POST',
        body: JSON.stringify(compact(formattedFails)),
      });
      dispatch({ type: actionNames.ACCEPT_ALL_REFS, payload: updatedData });
    } catch (e) {
      // handle error
    }
  };
};

export const setUrl = (value) => ({
  type: actionNames.UPDATE_URL,
  payload: value,
});
export const setScreenViewMode = (value) => ({
  type: actionNames.SET_SCREEN_VIEW_MODE,
  payload: value,
});
export const setTestsViewMode = (value) => ({
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
