import { Dispatch } from 'redux';
import { flatMap, compact } from 'lodash';
import { filterFailedBrowsers, filterAcceptableBrowsers, formatTests } from '../utils';
import * as actionNames from './constants';
import { CompiledData } from 'src/store/modules/tests/types';

export const initGui = () => {
  return async (dispatch: Dispatch) => {
    try {
      const appState: CompiledData = await fetch('/init').then((res) => res.json());

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
