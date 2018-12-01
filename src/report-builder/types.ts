export interface ISkip {
  suite: any;
  browser: any;
  comment: any;
}

export interface ITree {
  children?: object[];
  name: string;
}

export interface ITestResult {
  attempt?: number;
  status?: string;
  browserId?: string;
  description: string;
  imagesInfo: any;
  metaInfo: any;
  multipleTabs: any;
  name: string;
  screenshot: string;
  suiteUrl: string;
  props: object;
  sessionId: string;
  assertViewResults: any;
  err: any;
  id: any;
  retriesLeft: any;
  meta: string;
  skipReason: any;
  parent: ITestResult;
  fullTitle: () => string;
  root: string;
  title: string;
  file: string;
}

export interface IChild {
  name: object;
  suitePath?: string;
}
