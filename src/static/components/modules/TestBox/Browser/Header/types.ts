import { TestStatus } from 'src/store/modules/tests/types';
import { ResultViewerProps } from '../Viewer/types';

export interface HeaderProps {
  data: ResultViewerProps;
  status: TestStatus;
  title: string;
  className?: string;
  isOpenedBrowser: boolean;
  handleViewChange: (e: string) => void;
  viewType: string;
  handleDataChange: (e: number) => void;
  pageCount: number;
  pageCurrent: number;
  onToggle: () => any;
  url: string;
}
