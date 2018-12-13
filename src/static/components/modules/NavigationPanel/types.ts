import { setTestsType } from 'src/store/modules/app/actions';

export interface NavigationPanelProps {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  retries: number;

  setTestsType: typeof setTestsType;
}
