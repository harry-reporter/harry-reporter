import { TestsStore, WindowWithData } from './types';
import { getInitialState, formatSuitesDataTemp, addTestResult } from './utils';
import * as actionNames from './constants';

const defaultState: TestsStore = {
  tests: [],
  skips: [],
  stats: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    retries: 0,
  },
  gui: true,
};

const compiledData = (window as WindowWithData).data;

const initialState = compiledData
  ? getInitialState(compiledData)
  : defaultState;

export const reducer = (state: TestsStore = initialState, action): TestsStore => {
  const { type, payload } = action;

  switch (type) {

    case actionNames.INIT_GUI: {
      const { skips, suites, gui, config } = payload;
      return { ...state, skips, gui, config, ...formatSuitesDataTemp(suites) };
    }

    case actionNames.ACCEPT_ALL_REFS:
      return addTestResult(state, action);

    default:
      return state;
  }
};
