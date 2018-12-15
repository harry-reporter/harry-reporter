import configParser from 'gemini-configparser';
import _ from 'lodash';

const root = configParser.root;
const section = configParser.section;
const option = configParser.option;

const ENV_PREFIX = 'harry_reporter_';
const CLI_PREFIX = '--harry-reporter-';

import { config as configDefaults } from './constants/defaults';
import { IPluginOpts } from './types';

const assertType = (name: string, validationFn: <T>(value: T) => boolean, type: string) => {
  return (value: string | number | boolean): void | Error => {
    if (!validationFn(value)) {
      throw new Error(`"${name}" option must be ${type}, but got ${typeof value}`);
    }
  };
};
const assertString = (name: string) => assertType(name, _.isString, 'string');
const assertBoolean = (name: string) => assertType(name, _.isBoolean, 'boolean');
const assertNumber = (name: string) => assertType(name, _.isNumber, 'number');

const getParser = () => {
  return root(section({
    baseHost: option({
      defaultValue: configDefaults.baseHost,
      validate: assertString('baseHost'),
    }),
    defaultView: option({
      defaultValue: configDefaults.defaultView,
      validate: assertString('defaultView'),
    }),
    enabled: option({
      defaultValue: true,
      parseCli: JSON.parse,
      parseEnv: JSON.parse,
      validate: assertBoolean('enabled'),
    }),
    lazyLoadOffset: option({
      defaultValue: configDefaults.lazyLoadOffset,
      parseEnv: JSON.parse,
      validate: assertNumber('lazyLoadOffset'),
    }),
    path: option({
      defaultValue: 'html-report',
      validate: assertString('path'),
    }),
    scaleImages: option({
      defaultValue: configDefaults.scaleImages,
      parseCli: JSON.parse,
      parseEnv: JSON.parse,
      validate: assertBoolean('scaleImages'),
    }),
  }), { envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX });
};

export default (options: IPluginOpts) => {
  const env = process.env;
  const argv = process.argv;

  return getParser()({ options, env, argv });
};
