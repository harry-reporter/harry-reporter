export type TestStatus = 'error' | 'fail' | 'success';

export interface TestsStore {
  tests: Suite[];
  skips: Suite[];
  stats: Stats;
  gui: boolean;
  suites?: Suites;
  suiteIds?: SuiteIds;
  config?: Config;
}

export interface Stats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  retries: number;
}

export interface Suites {
  [key: string]: Suite;
}

export interface CompiledData extends Stats {
  skips: Skip[];
  config: Config;
  suites: Suite[];
  gui?: boolean;
}

export type Skip = any;
export type SuitePath = string[];

export interface Config {
  defaultView: string;
  baseHost: string;
  scaleImages: boolean;
  lazyLoadOffset: number;
}

export interface Suite {
  name: string;
  suitePath: SuitePath;
  status: TestStatus;
  children?: Suite[];
  browsers?: Browser[];
}

export interface SuiteIds {
  all: string[];
  failed: string[];
}

export interface Browser {
  name: string;
  result: Attempt;
  retries: Attempt[];
}

export interface Attempt {
  suiteUrl: string;
  name: string;
  metaInfo: MetaInfo;
  imagesInfo: ImageInfo[];
  screenshot: boolean;
  multipleTabs: boolean;
  status: TestStatus;
  attempt: number;
}

export interface MetaInfo {
  url: string;
  file: string;
  sessionId: string;
}

export interface ImageInfo {
  stateName: string;
  status: string;
  actualPath: string;
  imagePath: string;
  expectedPath: string;
}

export interface WindowWithData extends Window {
  data: CompiledData;
}
