import { createSelector } from 'reselect';
import { RootStore } from 'src/store/types/store';
import { switchTestViewMod } from '../../../../common-utils';

const appSelector = (store: RootStore) => store.app;
const getProps = (_, props) => props;

export const viewSelector = createSelector(
  appSelector,
  getProps,
  (app, propsData) => {
    return {
      isOpenedScreenView: isOpen(app, propsData.viewId, propsData.status),
    };
  },
);

const isOpen = (app, viewId, status) => {
  let isOpenedView = app.isOpenPerView[viewId];
  if (isOpenedView === undefined) {
    isOpenedView = switchTestViewMod(
      app.testsViewMode,
      status,
    );
  }
  return isOpenedView;
};
