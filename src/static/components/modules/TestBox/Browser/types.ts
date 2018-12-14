import {
  Browser,
  Attempt,
  TypeView,
  Suite,
  TestStatus,
} from 'src/store/modules/tests/types';
import { TestBoxesCache } from 'src/components/modules/TestBox/utils';

export interface BrowserProps {
  isGui: boolean;
  isRunning: boolean;
  status: TestStatus;
  data: Browser;
  url?: string;
  isOpenedBrowser?: boolean;
  setIsOpenForBrowser?: (isOpen: boolean, uuid: string) => void;
  measure?: () => any;
  cache?: TestBoxesCache;
  suiteData?: Suite;
  index: number;
  onAccept: (browserId, attempt, stateName?) => void;
  gitUrl?: string;
}
export interface BrowserState {
  viewType: TypeView;
  viewData?: Attempt;
  pageCount: number;
  pageCurrent: number;
  isOpen: boolean;
}
