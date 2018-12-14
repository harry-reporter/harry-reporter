import { Attempt } from 'src/store/modules/tests/types';

export interface ControlsProps {
  isOpenedBrowser: boolean;
  data: Attempt;
  handleViewChange: (e: string) => void;
  onToggle: () => any;
  viewType: string;
  url: string;
}
