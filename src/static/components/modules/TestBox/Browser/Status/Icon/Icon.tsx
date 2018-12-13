import * as React from 'react';

import Octicon, { Check, Icon, X } from '@githubprimer/octicons-react';
import { withMargin } from 'src/components/hoc/withMargin';

import { IconProps } from './types';

const Icon: React.SFC<IconProps> = ({ isFail, className }) => {
  const OcticonIcon: Icon = isFail ? X : Check;

  return (
    <span className={className}>
      <Octicon icon={OcticonIcon} />
    </span>
  );
};

export default withMargin<IconProps>(Icon);
