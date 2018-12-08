import { Icon } from '@githubprimer/octicons-react';

export interface ButtonProps {
  className?: string;
  asLink?: boolean;
  icon?: Icon;
  title?: string;
  isSelected?: boolean;
  size?: 'sm';

  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
}
