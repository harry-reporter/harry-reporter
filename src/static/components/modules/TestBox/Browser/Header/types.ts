import { TestStatus, Attempt, TypeView } from 'src/store/modules/tests/types';

export interface HeaderProps {
  data: Attempt;
  className?: string;
  isOpenedBrowser: boolean;
  handleViewChange: (e: string) => void;
  viewType: TypeView;
  handleDataChange: (e: number) => void;
  pageCount: number;
  pageCurrent: number;
  onToggle: () => any;
  url: string;
}