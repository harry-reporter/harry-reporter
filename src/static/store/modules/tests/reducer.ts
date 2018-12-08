import { TestsStore, WindowWithData } from './types';
import { getInitialState } from './utils';

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
};

const compiledData = getInitialState((window as WindowWithData).data) || defaultState;

const SET_INIT = 'SET_INIT';

export const reducer = (state: TestsStore = compiledData, action): TestsStore => {
  const { type } = action;

  switch (type) {
    case `${SET_INIT}`:
      return { ...state };

    default:
      return state;
  }
};
