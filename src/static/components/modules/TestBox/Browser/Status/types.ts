import { TestStatus, Attempt } from 'src/store/modules/tests/types';

export interface StatusProps {
  title?: string;
  status?: TestStatus;
  className?: string;
  data: Attempt;
  pageCount: number;
  pageCurrent: number;
  skipComment: string;

  handleDataChange: (e: number) => void;
  onClickAtTitle: (e) => any;
}
