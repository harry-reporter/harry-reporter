import { AppStore, TestsTypeKey } from './types';
import * as actionNames from './constants';

const defaultState: AppStore = {
  selectedTestsType: TestsTypeKey.total,
  url: '',
  screenViewMode: '3-up',
  testsViewMode: 'expandErrors',
  running: false,
};

export const reducer = (state: AppStore = defaultState, action): AppStore => {
  const { type, payload } = action;

  switch (type) {
    case actionNames.SET_TESTS_TYPE:
      return { ...state, selectedTestsType: payload };

    case actionNames.UPDATE_URL:
      return { ...state, url: payload };

    case actionNames.SET_SCREEN_VIEW_MODE:
      return { ...state, screenViewMode: payload };

    case actionNames.SET_TESTS_VIEW_MODE:
      return { ...state, testsViewMode: payload };

    default: return state;
  }
};
