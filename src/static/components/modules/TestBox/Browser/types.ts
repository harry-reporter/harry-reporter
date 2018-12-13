import { Browser, Attempt, TypeView } from 'src/store/modules/tests/types';

export interface BrowserProps {
  isGui: boolean;
  data: Browser;
  url?: string;
  isOpenedBrowser?: boolean;
  setIsOpenForBrowser?: (isOpen: boolean, uuid: string) => void;
  measure?: () => any;
  onAccept: (browserId, attempt, stateName?) => void;
}
export interface BrowserState {
  viewType: TypeView;
  viewData?: Attempt;
  pageCount: number;
  pageCurrent: number;
}
