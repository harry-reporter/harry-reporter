import { createSelector } from 'reselect';
import { RootStore } from 'src/store/types/store';
import { switchTestViewMod } from '../common-utils';

const appSelector = (store: RootStore) => store.app;
const getProps = (_, props) => props.data;

export const browserSelector = createSelector(
  appSelector,
  getProps,
  (app, propsData) => {
    return {
      isOpenedBrowser: isOpen(app, propsData.browsersId, propsData.status),
      url: app.url,
    };
  },
);

const isOpen = (app, browsersId: string, status: string) => {
  let isOpenedBrowser = app.isOpenPerBrowser[browsersId];
  if (isOpenedBrowser === undefined) {
    isOpenedBrowser = switchTestViewMod(
      app.testsViewMode,
      status,
    );
  }
  return isOpenedBrowser;
};
