export enum TestsTypeKey {
  total = 'total',
  passed = 'passed',
  failed = 'failed',
  skipped = 'skipped',
  retries = 'retries',
}

export interface AppStore {
  selectedTestsType: TestsTypeKey;
  url: string;
  screenViewMode: ScreenViewMode;
  testsViewMode: TestsViewMode;
  running: boolean;
}

export type ScreenViewMode = '3-up' | 'onlyDiff' | 'loupe' | 'swipe' | 'onionSkin';
export type TestsViewMode = 'collapseAll' | 'expandAll' | 'expandErrors' | 'expandRetries';
