import { TypeView } from 'src/store/modules/tests/types';

export interface ControlViewersProps {
  onChange: (e: any) => void;
  viewType: TypeView;
  isOpenedBrowser: boolean;

  measure?: () => any;
}
export interface ControlViewersState { }
