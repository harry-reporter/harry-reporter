import { AppStore, TestsTypeKey } from './types';
import * as actionNames from './constants';

const defaultState: AppStore = {
  selectedTestsType: TestsTypeKey.total,
  url: '',
  screenViewMode: '3-up',
  testsViewMode: 'expandErrors',

  isOpenPerTestBox: {},
  isOpenPerBrowser: {},
  isOpenPerView: {},
  screenPerView: {},
};

export const reducer = (state: AppStore = defaultState, action): AppStore => {
  const { type, payload } = action;

  switch (type) {
    case actionNames.SET_TESTS_TYPE:
      return { ...state, selectedTestsType: payload };

    case actionNames.UPDATE_URL:
      return { ...state, url: payload };

    case actionNames.SET_SCREEN_VIEW_MODE:
      return { ...state, screenViewMode: payload, screenPerView: {} };

    case actionNames.SET_TESTS_VIEW_MODE:
      return {
        ...state,
        testsViewMode: payload,
        isOpenPerTestBox: {},
        isOpenPerBrowser: {},
        isOpenPerView: {},
      };

    case actionNames.SET_IS_OPEN_FOR_TEST_BOX:
      const testBoxUuid: string = payload.uuid;
      const isOpen: boolean = payload.isOpen;
      const newIsOpenPerTestBox = {
        ...state.isOpenPerTestBox,
        [testBoxUuid]: isOpen,
      };
      return { ...state, isOpenPerTestBox: newIsOpenPerTestBox };

    case actionNames.SET_IS_OPEN_FOR_BROWSER:
      const browsersId: string = payload.browsersId;
      const isOpenedBrowser: boolean = payload.isOpenedBrowser;
      const newIsOpenPerBrowser = {
        ...state.isOpenPerBrowser,
        [browsersId]: isOpenedBrowser,
      };
      return { ...state, isOpenPerBrowser: newIsOpenPerBrowser };

    case actionNames.SET_IS_OPEN_FOR_VIEW:
      const screenViewId: string = payload.screenViewId;
      const isOpenScreenView: boolean = payload.isOpenScreenView;
      const newIsOpenPerView = {
        ...state.isOpenPerView,
        [screenViewId]: isOpenScreenView,
      };
      return { ...state, isOpenPerView: newIsOpenPerView };

    case actionNames.SET_SCREEN_FOR_VIEW:
      const screenViewModId: string = payload.screenViewModId;
      const screenViewMod: string = payload.screenViewMod;
      const newScreenPerView = {
        ...state.screenPerView,
        [screenViewModId]: screenViewMod,
      };
      return { ...state, screenPerView: newScreenPerView };

    default:
      return state;
  }
};
