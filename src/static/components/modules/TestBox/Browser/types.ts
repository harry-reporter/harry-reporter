import { ResultViewerProps } from './Viewer/types';

export interface BrowserProps {
  data: any;
  url?: string;
  isOpenedBrowser?: boolean;
  setIsOpenForBrowser?: (isOpen: boolean, uuid: string) => void;
  measure?: () => any;
}
export interface BrowserState {
  viewType: string;
  viewData: ResultViewerProps;
  pageCount: number;
  pageCurrent: number;
}
