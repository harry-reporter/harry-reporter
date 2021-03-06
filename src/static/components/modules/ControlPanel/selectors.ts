import { createSelector } from 'reselect';
import { TestsStore, SuiteIds } from 'src/store/modules/tests/types';
import { values, pick } from 'lodash';

const suitesSelector = (store: TestsStore) => store.suites;
const suitesIdSelector = (store: TestsStore) => store.suiteIds;

export const failedSuitesSelector = createSelector(
  suitesSelector,
  suitesIdSelector,
  (suites, suiteIds: SuiteIds) => {
    if (suites && suiteIds) {
      return values(pick(suites, suiteIds.failed));
    }
  },
);
