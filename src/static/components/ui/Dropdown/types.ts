export interface DropdownProps {
  title: string;
  className?: string;
  isOpened?: boolean;

  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
}
