import axios from 'axios';
import { Dispatch } from 'redux';
import { assign, flatMap, compact } from 'lodash';
import * as status from '../../../../constants/test-statuses';

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
    } catch (err) {
      // tslint:disable-next-line no-console
      console.error('Error while getting initial data:', err);
    }
  };
};

const runTests = ({ tests = [], action = {} } = {}) => {
  return async (dispatch) => {
    try {
      await axios.post('/run', tests);
      dispatch(action);
    } catch (err) {
      // tslint:disable-next-line no-console
      console.error('Error while running tests:', err);
    }
  };
};

export const runAllTests = () => {
  return runTests({
    action: { type: actionNames.RUN_ALL, payload: {status: status.QUEUED} },
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
      const { data: updatedData } = await axios.post('/update-reference', compact(formattedFails));
      dispatch({ type: actionNames.ACCEPT_ALL_REFS, payload: updatedData });
    } catch (err) {
      // tslint:disable-next-line no-console
      console.error('Error while updating references of failed tests:', err);
    }
  };
};

export const acceptTest = (suite, browserId, attempt, stateName) =>
  acceptAll(assign({ browserId, stateName }, suite, { acceptTestAttempt: attempt }));

export const retryTest = (suite) => {
  return runTests({ tests: [suite], action: { type: actionNames.RETRY_TEST }});
};

export const suiteBegin = (suite) => ({ type: actionNames.SUITE_BEGIN, payload: suite });
export const testBegin = (test) => ({ type: actionNames.TEST_BEGIN, payload: test });
export const testResult = (result) => ({ type: actionNames.TEST_RESULT, payload: result });
export const testsEnd = (stats) => ({ type: actionNames.TESTS_END, payload: stats });
