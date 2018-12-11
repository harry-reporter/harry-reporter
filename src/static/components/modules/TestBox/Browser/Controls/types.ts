import { ResultViewerProps } from '../Viewer/types';

export interface ControlsProps {
  isOpenedBrowser: boolean;
  data: ResultViewerProps;
  handleViewChange: (e: string) => void;
  onToggle: () => any;
  viewType: string;
  url: string;
}
