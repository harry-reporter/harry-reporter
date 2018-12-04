import { IImagesInfo } from '../test/types';

export interface ITree {
  children?: object[];
  name: string;
}

export interface IHermioneStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  retries: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IScreenshot {
  base64: string;
  size: ISize;
}

export interface IHermioneCtx {
  assertViewResults: any;
}

export interface IMeta {
  url: string;
  file: string;
  sessionId: string;
}

export interface IBrowserState {
  isBroken: boolean;
}

export interface ICause {
  type: string;
  $error: string;
  showDiff: boolean;
  actual: boolean;
  expected: boolean;
  screenshot: IScreenshot;
  hermioneCtx: IHermioneCtx;
  meta: IMeta;
  browserState: IBrowserState;
}

export interface IErr {
  cause: ICause;
  isOperational: boolean;
  type: string;
  $error: string;
  showDiff: boolean;
  actual: boolean;
  expected: boolean;
  screenshot: IScreenshot;
  hermioneCtx: IHermioneCtx;
  meta: IMeta;
  browserState: IBrowserState;
}

export interface IReason {
  message: string;
  stack: string;
}

export interface IActualImg {
  path: string;
  size: ISize;
}

export interface IHermioneResult {
  sessionId: string;
  browserId: string;
  err: IErr;
  assertViewResults: any[];
  meta: IMeta;
  hermioneCtx: IHermioneCtx;
  duration: number;
  attempt?: any;
  imagesInfo: IImagesInfo[];
  retriesLeft: number;

  // Unexplicit types
  description: string;
  file: string;
  image: boolean;
  parent: IHermioneResult;
  root: IHermioneResult;
  skipReason: string;
  title: string;
  fullTitle: () => string;
  id: () => string;
}
