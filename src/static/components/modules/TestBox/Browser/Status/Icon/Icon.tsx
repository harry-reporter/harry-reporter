import * as React from 'react';

import Octicon, { Check, X } from '@githubprimer/octicons-react';
import { withMargin } from 'src/components/hoc/withMargin';

import { IconProps } from './types';

const Icon: React.SFC<IconProps> = ({ status, className }) => {

  const getIcon = () => {
    switch (status) {
      case 'fail':
      case 'error': return X;
      case 'success': return Check;

      default: return null;
    }
  };

  const icon = getIcon();

  return (
    <span className={className}>
      {icon && <Octicon icon={icon} />}
    </span>
  );
};

export default withMargin<IconProps>(Icon);
