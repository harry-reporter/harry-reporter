import { createSelector } from 'reselect';
import { RootStore } from 'src/store/types/store';
import { switchTestViewMod } from '../common-utils';
import { BrowserProps } from 'src/components/modules/TestBox/Browser/types';

const appSelector = (store: RootStore) => store.app;
const getProps = (_, props) => props.data;
const getSkip = (store: RootStore, props: BrowserProps) => {
  return store.tests.skips[`${props.testBoxIndex} ${props.data.name}`];
};

const isOpen = (app, browsersId: string, status: string) => {
  let isOpenedBrowser = app.isOpenPerBrowser[browsersId];
  if (isOpenedBrowser === undefined) {
    isOpenedBrowser = switchTestViewMod(app.testsViewMode, status);
  }
  return isOpenedBrowser;
};

export const browserSelector = createSelector(
  appSelector,
  getProps,
  getSkip,
  (app, propsData, skip) => {
    return {
      isOpenedBrowser: isOpen(app, propsData.browsersId, propsData.status),
      url: app.url,
      skipComment: (skip && skip.comment) || '',
    };
  },
);
