import * as React from 'react';
import cn from 'classnames';
import { withPadding } from 'src/components/hoc/withPadding';

interface HeaderProps {
  className?: string;
  title?: string;
}

const Header: React.SFC<HeaderProps> = ({ children, className }) => {
  const cnHeader = cn(className);

  return (
    <header className={cnHeader}>{children}</header>
  );
};

export default withPadding<HeaderProps>(Header);
