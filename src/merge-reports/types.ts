import {IHermioneConfig} from '../types';
import {IReason, ISkip, IMetaInfo, IProps} from '../test-result/types';

export interface IImageInfo {
  status?: string;
  reason?: IReason;
  actualPath?: string;
  expectedPath?: string;
  diffPath?: string;
}

export interface ITest {
  attempt: number;
  imagesInfo: IImageInfo[];
  metaInfo: IMetaInfo;
  multipleTabs: boolean;
  name: string;
  reason: IReason;
  screenshot: boolean;
  status: string;
  suiteUrl: string;
}

export interface IBrowser {
  name: string;
  result: ITest;
  retries: ITest[];
}

export interface ISuite {
  name: string;
  suitePath: string[];
  browsers?: IBrowser[];
  children?: ISuite[];
}

export interface IData {
  config: IHermioneConfig;
  skips: ISkip[];
  suites: ISuite[];
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  retries: number;
  [key: string]: any;
}

export interface IDataCollection {
  [key: string]: IData;
}
