import chalk from 'chalk';
import opener from 'opener';
import { logError, logger } from '../server-utils';
import { IApi } from './api';
import serverStart from './server';

export default (args: IArgs) => {
  serverStart(args)
    .then(({ url }: { url: string }) => {
      logger.log(`GUI is running at ${chalk.cyan(url)}`);
      if (args.configs.options.open) {
        opener(url);
      }
    })
    .catch((err: Error) => {
      logError(err);
      process.exit(1);
    });
};

export interface IArgs {
  paths: string;
  hermione: any;
  guiApi: IApi;
  configs: {
    options: any;
    program: any;
    pluginConfig: any
  };
}
