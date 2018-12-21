import * as React from 'react';
import cn from 'classnames';

import { TextProps } from './types';
import { withMargin } from 'src/components/hoc/withMargin';
import { withPadding } from 'src/components/hoc/withPadding';

import './style.css';

const Text: React.SFC<TextProps> = ({ as: Tag, children, className, textColor, textType, textWidth, onClick }) => {
  const cnText = cn(className, `text-${textType}`, `text-${textColor}`, `m-0`, `text-${textWidth}`);

  return (
    <Tag onClick={onClick} className={cnText}>{children}</Tag>
  );
};

Text.defaultProps = {
  textType: 'normal',
  as: 'p',
  textColor: 'gray-dark',
};

export default withPadding(withMargin(Text));
