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
  // хэш-таблица, ключ=uuid test-box'а, значение=boolean его локальное состоения isOpen выбранное пользвоателем.
  // Если в этой хэш таблице нет значения для конкретного test-box'а, значит локально пользователь ничего не переопределял
  // и мы можем применить глобальные настройки view mode из NavigationPanel
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
      // Не забуем стереть хэш таблицу isOpenTestBox, когда в глобальной навигационной панели поменялось значение testsViewMode
      return { ...state, testsViewMode: payload, isOpenPerTestBox: {} };

    case actionNames.SET_IS_OPEN_FOR_TEST_BOX:
      // Изменение состояния isOpen для отдельно взятого view box - когда пользователь вручную кликнул по шеврону внутри какого-то view box
      // в payload в этом случае приходит два параметра:
      const testBoxUuid: string = payload.uuid; // uuid изменяемого view box (тот view box в котором пользователь кликнул и изменил view modd)
      const isOpen: boolean = payload.isOpen; // новое значение для view mode (выбранное пользователем)

      // Сначала подготовим новую структуру для хэш-таблицы testsViewModePerTestBox, где одно значение обновлено
      const newIsOpenPerTestBox = {
        ...state.isOpenPerTestBox,
        [testBoxUuid]: isOpen,
      };

      // Вкладываем обновлённую хэш таблицу в объект state
      return { ...state, isOpenPerTestBox: newIsOpenPerTestBox };

    case actionNames.SET_IS_OPEN_FOR_BROWSER:
      // uuid изменяемого браузера (viewbox, в котором пользователь кликнул и изменил view mode)
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

    default:
      return state;
  }
};
