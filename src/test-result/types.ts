import { IHermioneConfig } from '../types';

// Iinterfaces from data.js
export interface ISkip {
  suite: string;
  browser: string;
  comment: string;
}

export interface IReason {
  message: string;
  stack: string;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IActualImg {
  path: string;
  size: ISize;
}

export interface IRefImg {
  path: string;
  size: ISize;
}

export interface IExpectedImg {
  path: string;
  size: ISize;
}

export interface IImagesInfo {
  status: string;
  reason: IReason;
  actualImg: IActualImg;
  stateName: string;
  refImg: IRefImg;
  expectedImg: IExpectedImg;
  imagePath: string;
  currentImagePath: string;
}

export interface IMetaInfo {
  url: string;
  file: string;
  sessionId: string;
}

export interface IProps {
  reason?: any;
  status?: string;
  attempt?: number;
}

export interface IResult {
  status?: string;
  imagesInfo: IImagesInfo[];
  metaInfo: IMetaInfo;
  multipleTabs: boolean;
  name: string;
  screenshot: boolean;
  suiteUrl: string;
  attempt?: any;
}

export interface IRetry {
  imagesInfo: IImagesInfo[];
  metaInfo: IMetaInfo;
  multipleTabs: boolean;
  name: string;
  screenshot: boolean;
  suiteUrl: string;
}

export interface IBrowser {
  name: string;
  result: IResult;
  retries: IRetry[];
}

export interface IChild {
  name: string;
  suitePath: string[];
  browsers?: IBrowser[];
}

export interface ISuite {
  name: string;
  suitePath: string[];
  children: IChild[];
}

export interface IData {
  config: IHermioneConfig;
  extraItems: any;
  skips: ISkip[];
  suites: ISuite[];
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  retries: number;
}
