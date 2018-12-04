import Suite from './suite/suite';
import { IHermioneResult } from './report-builder/types';

export const getSuitePath = (suite: IHermioneResult): string[] => suite.root
  ? []
  : [].concat(getSuitePath(suite.parent)).concat(suite.title);
