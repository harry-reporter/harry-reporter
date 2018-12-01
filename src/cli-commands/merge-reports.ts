import commands from './';
import mergeReports from '../merge-reports';
import {logError} from '../server-utils';

export default (program: any, {path}: {path: string}) => {
  program
    .command(`${commands.MERGE_REPORTS} [paths...]`)
    .allowUnknownOption()
    .description('merge reports')
    .option('-d, --destination <destination>', 'path to directory with merged report', path)
    .action(async (paths: string, options: any) => {
      try {
        await mergeReports(paths, options);
      } catch (err) {
        logError(err);
        process.exit(1);
      }
    });
};
