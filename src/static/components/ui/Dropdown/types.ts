export interface DropdownProps {
  title: string;
  items: Item[];
  className?: string;
  isOpened?: boolean;

  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
  onChange?: (v: string) => any;
}

interface Item {
  title: string;
  value: string;
}
