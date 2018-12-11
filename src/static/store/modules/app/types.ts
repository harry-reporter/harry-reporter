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
  screenViewMode: '3-up' | 'onlyDiff' | 'loupe' | 'swipe' | 'onionSkin';
  testsViewMode: 'collapseAll' | 'expandAll' | 'expandErrors' | 'expandRetries';
  isOpenPerTestBox: { [key: string]: boolean };
  isOpenPerBrowser: { [key: string]: boolean };
  isOpenPerView: { [key: string]: boolean };
  screenPerView: { [key: string]: string };
}
