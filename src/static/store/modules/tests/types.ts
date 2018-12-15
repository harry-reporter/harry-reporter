export type TestStatus = 'error' | 'fail' | 'success' | 'idle' | 'running' | 'skipped';

export interface TestsStore {
  skips: Suite[];
  stats: Stats;
  gui: boolean;
  running?: boolean;
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
  running: boolean;
}

export type Skip = any;
export type SuitePath = string[];

export interface Config {
  defaultView: string;
  baseHost: string;
  scaleImages: boolean;
  lazyLoadOffset: number;
  gitUrl?: string;
}

export interface Suite {
  name: string;
  suitePath: SuitePath;
  status: TestStatus;
  children?: Suite[];
  browsers?: Browser[];
  uuid?: string;
}

export interface SuiteIds {
  all: string[];
  failed: string[];
}

export interface Browser {
  name: string;
  result: Attempt;
  retries: Attempt[];
  browserId: string;
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

  reason?: ReasonProps;
  type?: TypeView;
  className?: string;
  measure?: () => any;
  isOpenedScreenView?: boolean;
  setIsOpenForView?: (isOpenScreenView: boolean, screenViewId: string) => void;
}

export interface MetaInfo {
  url: string;
  file: string;
  sessionId: string;
}

export interface ImageInfo {
  stateName: string;
  status: TestStatus;
  actualPath?: string;
  imagePath: string;
  expectedPath?: string;
  reason?: ReasonProps;
  refImagePath?: string;
  diffPath?: string;
  onLoad?: any;
  screenViewMode?: string;
  setScreenModForView?: (
    screenViewMod: string,
    screenViewModId: string,
  ) => void;
  viewId?: string;
  isOpenedScreenView?: boolean;
  isOpen?: boolean;
  setIsOpenForView?: (isOpenScreenView: boolean, screenViewId: string) => void;
  measure?: () => any;
}

export interface WindowWithData extends Window {
  data: CompiledData;
}

export type TypeView = 'code' | 'tests' | 'screenshot';

export interface ReasonProps {
  message: string;
  stack: string;
}

export interface FormatSuitesDataArgs {
  suites: Suites | Suite[];
  filterSuites?: (suite: Suite) => boolean;
  filterBrowsers?: (browser: Browser) => boolean;
}
