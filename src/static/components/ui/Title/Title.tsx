import * as React from 'react';

import { TitleProps } from './types';

const Title: React.SFC<TitleProps> = ({ as: Tag, children }) => {
  return (
    <Tag className={Tag}>{children}</Tag>
  );
};

export default Title;
