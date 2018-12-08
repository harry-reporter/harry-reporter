import { TestsStore } from '../modules/tests/types';
import { AppStore } from '../modules/app/types';

export enum StoreKey {
  tests = 'tests',
  app = 'app',
}

export type RootStore = {
  [StoreKey.tests]?: TestsStore;
  [StoreKey.app]?: AppStore;
};
