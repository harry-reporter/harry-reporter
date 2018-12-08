import { NavItemId } from 'src/components/ui/Navigation/types';

export interface NavigationPanelProps {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  retries: number;

  setTestsType: any;
}
