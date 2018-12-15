import { runAllTests, initGui, runFailedTests, acceptAll } from 'src/store/modules/tests/actions';
import { Suite } from '../../../store/modules/tests/types';

export interface ControlPanelProps {
  url: string;
  isGui: boolean;
  isRunning: boolean;
  failed?: Suite[];

  setUrl: (value: string) => {type: string, payload: string};
  setScreenViewMode: (value: string) => {type: string, payload: string};
  setTestsViewMode: (value: string) => {type: string, payload: string};
  initGui: typeof initGui;
  runAllTests: typeof runAllTests;
  runFailedTests: typeof runFailedTests;
  acceptAll: typeof acceptAll;
}
