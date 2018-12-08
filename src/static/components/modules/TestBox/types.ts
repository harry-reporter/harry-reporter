import { Suite } from 'src/store/modules/tests/types';

export interface TestBoxProps {
  data: Suite;
  style?: React.CSSProperties;
  className?: string;

  measure?: () => any;
}
export interface TestBoxState {
  isOpen: boolean;
}

export interface Measurer {
  measure?: () => any;
}
