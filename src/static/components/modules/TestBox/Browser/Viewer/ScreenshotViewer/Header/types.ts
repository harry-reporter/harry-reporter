export interface HeaderProps {
  onToggle: () => any;
  stateName: string;
  onClick?: (isOpenScreenView: boolean, screenViewId: string) => void;
  isOpen?: boolean;
  color: string;
  className?: string;
}
