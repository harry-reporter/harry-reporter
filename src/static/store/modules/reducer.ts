import { combineReducers } from 'redux';

import { reducer as testsReducer } from './tests/reducer';
import { reducer as appReducer } from './app/reducer';
import { RootStore } from '../types/store';

export const rootReducer = combineReducers<RootStore>({
  tests: testsReducer,
  app: appReducer,
});

export default rootReducer;
