import { TestsStore, WindowWithData } from './types';
import { getInitialState } from './utils';
import { INIT_GUI } from './constants';

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
    case `${INIT_GUI}`:
      return { ...payload };

    default:
      return state;
  }
};
