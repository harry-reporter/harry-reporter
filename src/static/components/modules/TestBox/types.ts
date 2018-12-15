import { Suite } from 'src/store/modules/tests/types';
import { TestsTypeKey, TestsViewMode } from 'src/store/modules/app/types';
import { setTestsViewMode } from 'src/store/modules/app/actions';
import { TestBoxesCache } from 'src/components/modules/TestBox/utils';
import { retryTest } from 'src/store/modules/tests/actions';

export interface TestBoxProps {
  isGui: boolean;
  isRunning?: boolean;
  data: Suite;
  style?: React.CSSProperties;
  className?: string;
  isOpen?: boolean;
  uuid?: string;
  setIsOpenForTestBox?: (isOpen: boolean, uuid: string) => void;
  cache: TestBoxesCache;
  index: string;
  testsViewMode?: TestsViewMode;
  selectedTestsType: TestsTypeKey;
  running?: boolean;

  measure?: () => any;
  setTestsViewMode?: typeof setTestsViewMode;
  acceptTest?: (suite, browserId, attempt, stateName) => void;
  retryTest?: typeof retryTest;
}

export interface TestBoxState {
  isOpen: boolean;
}

export interface Measurer {
  measure?: () => any;
  cache?: TestBoxesCache;
  suiteData?: Suite;
}
