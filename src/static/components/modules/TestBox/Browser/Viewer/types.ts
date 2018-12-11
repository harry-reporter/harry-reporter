export interface ViewerProps {
  name: string;
  result: ResultViewerProps;
  retries: ResultViewerProps[];
  type: 'code' | 'tests' | 'screenshot';
  className?: string;
  measure: () => any;
}

export interface ResultViewerProps {
  attempt: number;
  imagesInfo: ImagesInfo[];
  metaInfo: MetaInfo;
  multipleTabs: boolean;
  name: string;
  screenshot: boolean;
  status: 'success' | 'fail' | 'error';
  suiteUrl: string;
  reason?: ReasonProps;
  type: 'code' | 'tests' | 'screenshot';
  className?: string;
  measure: () => any;
  isOpenedScreenView?: boolean;
  setIsOpenForView?: (isOpenScreenView: boolean, screenViewId: string) => void;
}

export interface ImagesInfo {
  actualPath?: string;
  reason?: ReasonProps;
  refImagePath: string;
  stateName: string;
  status: 'error' | 'success' | 'fail';
  expectedPath?: string;
  diffPath?: string;
  onLoad?: any;
  screenViewMode?: string;
  setScreenModForView?: (
    screenViewMod: string,
    screenViewModId: string,
  ) => void;
  viewId?: string;
  isOpenedScreenView?: boolean;
  setIsOpenForView?: (isOpenScreenView: boolean, screenViewId: string) => void;
  measure: () => any;
}

export interface MetaInfo {
  url: string;
  file: string;
  sessionId: string;
}
export interface ReasonProps {
  message: string;
  stack: string;
}
