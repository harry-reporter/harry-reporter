import { Browser, Attempt, TypeView } from 'src/store/modules/tests/types';

export interface BrowserProps {
  data: Browser;
  url?: string;
  isOpenedBrowser?: boolean;
  setIsOpenForBrowser?: (isOpen: boolean, uuid: string) => void;
  measure?: () => any;
}
export interface BrowserState {
  viewType: TypeView;
  viewData?: Attempt;
  pageCount: number;
  pageCurrent: number;
}
