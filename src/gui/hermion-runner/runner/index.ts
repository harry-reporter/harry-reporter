import _ from 'lodash';

import AllTestRunner from './all-test-runner';
import SpecificTestRunners from './specific-test-runner';

export default (collection: any, tests: any[]) => {
  return _.isEmpty(tests)
    ? new AllTestRunner(collection)
    : new SpecificTestRunners(collection, tests);
};
