import { TestStatus } from 'src/store/modules/tests/types';

export interface HeaderProps {
  title: string;
  status: TestStatus;
  isOpenedBox: boolean;
  isRunning: boolean;

  onToggle: () => any;
  retryHandler?: () => void;
  gitUrl?: string;
}

export interface HeaderState {}
