import { runAllTests } from 'src/store/modules/app/actions';
import { initGui } from 'src/store/modules/tests/actions';

export interface ControlPanelProps {
  url: string;
  isGui: boolean;

  setUrl: (value: string) => {type: string, payload: string};
  setScreenViewMode: (value: string) => {type: string, payload: string};
  setTestsViewMode: (value: string) => {type: string, payload: string};
  initGui: typeof initGui;
  runAllTests: typeof runAllTests;
  runFailedTests: any;
  acceptAll: any;
}
