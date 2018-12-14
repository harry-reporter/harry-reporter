import { createSelector } from 'reselect';
import { RootStore } from 'src/store/types/store';

const appSelector = (store: RootStore) => store.app;
const getProps = (_, props) => props;

export const screenSelector = createSelector(
  appSelector,
  getProps,
  (app, propsData) => {
    return {
      screenViewMode: screenModeView(app, propsData.viewId),
    };
  },
);

const screenModeView = (app, viewId) => {
  let screenViewMode = app.screenPerView[viewId];
  if (screenViewMode === undefined) {
    screenViewMode = app.screenViewMode;
  }
  return screenViewMode;
};

