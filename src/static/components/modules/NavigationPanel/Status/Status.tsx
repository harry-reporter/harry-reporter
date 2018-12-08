import * as React from 'react';

import Text from 'src/components/ui/Text';

import { StatusProps } from './types';
import { withMargin } from 'src/components/hoc/withMargin';

const Status: React.SFC<StatusProps> = ({ name, value, color }) => {
  return (
    <>
      <Text as={'span'} textType={'bold'} textColor={color}>
        {name}
      </Text>
      <Text as={'span'} textColor={color}>: {value}</Text>
    </>
  );
};

export default withMargin<StatusProps>(Status);
