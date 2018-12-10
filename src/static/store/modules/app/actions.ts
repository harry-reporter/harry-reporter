import { flatMap, compact } from 'lodash';
import * as actionNames from './constants';
import { filterFailedBrowsers, filterAcceptableBrowsers, formatTests } from '../../utils/utils';

export const setTestsType = (type) => ({ type: actionNames.SET_TESTS_TYPE, payload: type });

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
      const updatedData = await fetch(
        '/update-reference',
        { method: 'POST', body: JSON.stringify(compact(formattedFails)) },
      );
      dispatch({ type: actionNames.ACCEPT_ALL_REFS, payload: updatedData });
    } catch (e) {
      // handle error
    }
  };
};

export const setUrl = (value) => ({ type: actionNames.UPDATE_URL, payload: value });
export const setScreenViewMode = (value) => ({ type: actionNames.SET_SCREEN_VIEW_MODE, payload: value });
export const setTestsViewMode = (value) => ({ type: actionNames.SET_TESTS_VIEW_MODE, payload: value });
