import { EventEmitter } from 'events';
import ReportBuilder from './report-builder/report-builder';

interface IEvents {
  CLI: string;
  INIT: string;
  TEST_FAIL: string;
  TEST_PASS: string;
  TEST_PENDING: string;
  RETRY: string;
  RUNNER_END: string;
  SUITE_BEGIN: string;
  TEST_BEGIN: string;
}

export interface IPluginOpts {
  enabled?: boolean;
  path?: string;
  defaultView?: 'all' | 'failed';
  baseHost?: string;
  scaleImages?: boolean;
  lazyLoadOffset?: number;
}

export interface IHermioneConfig {
  defaultView: string;
  baseHost: string;
  scaleImages: boolean;
  lazyLoadOffset: number;
  forBrowser: any;
}

export interface IHermione extends EventEmitter {
  config: IHermioneConfig;
  events: IEvents;
  errors: object;
}

export type prepareDataType = (
  hermione: IHermione,
  reportBuilder: ReportBuilder,
) => any; // TODO добавить тип возвращаемого значения

export type prepareImagesType = (
  hermione: IHermione,
  pluginConfig: IPluginOpts,
  reportBuilder: ReportBuilder,
) => any; // TODO добавить тип возвращаемого значения
