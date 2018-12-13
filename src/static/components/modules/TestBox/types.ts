import { Suite } from 'src/store/modules/tests/types';
import { TestsViewMode } from 'src/store/modules/app/types';
import { setTestsViewMode } from 'src/store/modules/app/actions';
import { TestBoxesCache } from 'src/components/modules/TestBox/utils';

export interface TestBoxProps {
  data: Suite;
  style?: React.CSSProperties;
  className?: string;
  cache: TestBoxesCache;
  index: string;
  testsViewMode?: TestsViewMode;

  measure?: () => any;
  setTestsViewMode?: typeof setTestsViewMode;
}

export interface TestBoxState {
  isOpen: boolean;
}

export interface Measurer {
  measure?: () => any;
}
