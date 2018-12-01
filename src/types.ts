import { EventEmitter } from 'events';

interface IEvents {
  CLI: string;
  INIT: string;
  TEST_FAIL: string;
  TEST_PASS: string;
  TEST_PENDING: string;
  RETRY: string;
  RUNNER_END: string;
}

export interface IPluginOpts {
  enabled: boolean;
  path: string;
  defaultView: 'all' | 'failed';
  baseHost: string;
  scaleImages: boolean;
  lazyLoadOffset: number;
}

export interface IHermione extends EventEmitter {
  config: object;
  events: IEvents;
  errors: object;
}

export type prepareDataType = (hermione: IHermione, reportBuilder: any) => any;
// TODO добавить тип возвращаемого значения

export type prepareImagesType = (hermione: IHermione, pluginConfig: IPluginOpts, reportBuilder: any) => any;
// TODO добавить тип возвращаемого значения
