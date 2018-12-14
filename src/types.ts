import Promise from 'bluebird';
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
  gitUrl?: string;
}

export interface IHermioneConfig {
  defaultView: string;
  baseHost: string;
  scaleImages: boolean;
  lazyLoadOffset: number;
  forBrowser: any;
  gitUrl?: string;
}

export interface IHermione extends EventEmitter {
  config: IHermioneConfig;
  events: IEvents;
  errors: object;
}

export interface ICommonErrors {
  [key: string]: string;
}

export type prepareDataType = (
  hermione: IHermione,
  reportBuilder: ReportBuilder,
) => Promise<{}>;

export type prepareImagesType = (
  hermione: IHermione,
  pluginConfig: IPluginOpts,
  reportBuilder: ReportBuilder,
) => Promise<{}>;
