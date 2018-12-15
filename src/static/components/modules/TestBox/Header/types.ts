import { TestStatus } from 'src/store/modules/tests/types';

export interface HeaderProps {
  title: string;
  status: TestStatus;
  isOpenedBox: boolean;

  onToggle: () => any;
  retryHandler?: () => void;
}

export interface HeaderState {}
