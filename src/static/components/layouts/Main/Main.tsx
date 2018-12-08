import * as React from 'react';
import cn from 'classnames';

import { withPadding } from 'src/components/hoc/withPadding';

interface MainProps {
  className?: string;
}

const Main: React.SFC<MainProps> = ({ children, className }) => {
  const cnMain = cn('d-flex', 'flex-column',  className);
  return (
    <main className={cnMain}>
      {children}
    </main>
  );
};

export default withPadding<MainProps>(Main);
