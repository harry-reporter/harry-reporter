import { TestStatus } from 'src/store/modules/tests/types';

export interface IconProps {
  status: TestStatus;
  className?: string;
}
