import HermioneRunner from './HermioneRunner';

export default (paths: string, hermione: any, configs: any) => {
  return new HermioneRunner(paths, hermione, configs);
};
