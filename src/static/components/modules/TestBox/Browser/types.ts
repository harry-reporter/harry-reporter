import { Browser, Attempt, TypeView, Suite } from 'src/store/modules/tests/types';
import { TestBoxesCache } from 'src/components/modules/TestBox/utils';

export interface BrowserProps {
  isGui: boolean;
  data: Browser;
  url?: string;
  isOpenedBrowser?: boolean;
  setIsOpenForBrowser?: (isOpen: boolean, uuid: string) => void;
  measure?: () => any;
  cache?: TestBoxesCache;
  suiteData?: Suite;
  index: number;
  onAccept: (browserId, attempt, stateName?) => void;
}
export interface BrowserState {
  viewType: TypeView;
  viewData?: Attempt;
  pageCount: number;
  pageCurrent: number;
  isOpen: boolean;
}
