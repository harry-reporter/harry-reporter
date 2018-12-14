import { createSelector } from 'reselect';
import { RootStore } from 'src/store/types/store';
import { switchTestViewMod } from './common-utils';

const appSelector = (store: RootStore) => store.app;
const getProps = (_, props) => props.data;

export const testBoxSelector = createSelector(
  appSelector,
  getProps,
  (app, propsData) => {
    return isOpen(app, propsData.uuid, propsData.status);
  },
);

const isOpen = (app, uuid, status) => {
  let isOpenedTestBox = app.isOpenPerTestBox[uuid];
  if (isOpenedTestBox === undefined) {
    isOpenedTestBox = switchTestViewMod(
      app.testsViewMode,
      status,
    );
  }
  return isOpenedTestBox;
};
