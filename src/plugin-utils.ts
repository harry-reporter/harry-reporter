import { ITestResult } from './report-builder/types';

const getSuitePath = (suite: ITestResult): any => {
  return suite.root ? [] : [].concat(getSuitePath(suite.parent)).concat(suite.title);
};

export const getHermioneUtils = () => ({ getSuitePath });
