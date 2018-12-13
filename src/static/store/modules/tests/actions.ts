import axios from 'axios';
import { Dispatch } from 'redux';
import { flatMap, compact } from 'lodash';
import { filterFailedBrowsers, filterAcceptableBrowsers, formatTests } from '../utils';
import * as actionNames from './constants';

export const initGui = () => {
  return async (dispatch: Dispatch) => {
    try {
      const { data: appState } = await axios.get('/init');

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
      await await axios.post('/run', tests);
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
  const body = JSON.stringify(compact(formattedFails));

  return async (dispatch) => {
    try {
      const { data: updatedData } = await axios.post('/update-reference', compact(formattedFails));
      dispatch({ type: actionNames.ACCEPT_ALL_REFS, payload: updatedData });
    } catch (e) {
      // handle error
    }
  };
};

export const suiteBegin = (suite) => ({type: actionNames.SUITE_BEGIN, payload: suite});
export const testBegin = (test) => ({type: actionNames.TEST_BEGIN, payload: test});
export const testResult = (result) => ({type: actionNames.TEST_RESULT, payload: result});
export const testsEnd = () => ({type: actionNames.TESTS_END});
