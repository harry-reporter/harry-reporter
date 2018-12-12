import HermioneRunner from './hermione-runner';
import { IHermione } from '../../types';

export default (paths: string, hermione: IHermione, configs: any) => {
  return new HermioneRunner(paths, hermione, configs);
};
