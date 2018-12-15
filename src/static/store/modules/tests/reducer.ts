import { TestsStore, WindowWithData } from './types';
import { getInitialState, formatSuitesDataTemp, addTestResult, forceUpdateSuiteData, setStatusToAll } from './utils';
import { findNode } from '../utils';
import { clone, merge } from 'lodash';
import * as actionNames from './constants';

const defaultState: TestsStore = {
  suiteIds: {
    all: [],
    failed: [],
  },
  suites: {},
  skips: [],
  stats: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    retries: 0,
  },
  gui: true,
  running: false,
};

const compiledData = (window as WindowWithData).data;

const initialState = compiledData
  ? getInitialState(compiledData)
  : defaultState;

export const reducer = (
  state: TestsStore = initialState,
  action,
): TestsStore => {
  const { type, payload } = action;

  switch (type) {
    case actionNames.INIT_GUI: {
      const { skips, suites, gui, config, total, passed, failed, skipped, retries } = payload;
      return {
        ...state,
        skips,
        gui,
        config,
        ...formatSuitesDataTemp(suites),
        stats: { total, passed, failed, skipped, retries } };
    }

    case actionNames.ACCEPT_ALL_REFS:
      return addTestResult(state, action);

    case actionNames.RUN_ALL: {
      const suites = { ...state.suites };
      // setStatusToAll(suites, action.payload.status); // TODO: fix error
      return { ...state, suites, running: true };
    }

    case actionNames.SUITE_BEGIN: {
      const suites = clone(state.suites);
      const { suitePath, status } = action.payload;
      const test = findNode(suites, suitePath);
      if (test) {
        test.status = status;
        forceUpdateSuiteData(suites, test);
      }
      return { ...state, suites };
    }

    case actionNames.TEST_BEGIN: {
      const suites = clone(state.suites);
      const { suitePath, status, browserId } = action.payload;
      const test = findNode(suites, suitePath);
      if (test) {
        test.status = status;
        test.browsers.forEach((b) => {
          if (b.name === browserId) {
            b.result.status = status;
          }
        });
        forceUpdateSuiteData(suites, test);
      }
      return { ...state, suites };
    }

    case actionNames.RUN_FAILED:
    case actionNames.RETRY_SUITE:
    case actionNames.RETRY_TEST: {
      return { ...state, running: true };
    }

    case actionNames.TESTS_END: {
      return { ...state, running: false };
    }

    case actionNames.TEST_RESULT: {
      return addTestResult(state, action);
    }

    default:
      return state;
  }
};
