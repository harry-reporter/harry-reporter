import * as React from 'react';
import cn from 'classnames';

type Value = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface PaddingProps {
  pt?: Value;
  pr?: Value;
  pb?: Value;
  pl?: Value;
  p?: Value;

  className?: string;
}

function getPadding(name: string, value: Value) {
  return { [`${name}-${value}`]: value || false };
}

export function withPadding<P>(
  Component: React.ComponentType<P & PaddingProps>,
): React.ComponentType<P & PaddingProps> {
  return (props: PaddingProps) => {
    const { p = 0, pt = 0, pr = 0, pb = 0, pl = 0, className = '' } = props;

    const cnComponent = cn(className, {
      ...getPadding('pt', pt),
      ...getPadding('pr', pr),
      ...getPadding('pb', pb),
      ...getPadding('pl', pl),
      ...getPadding('p', p),
    });

    return <Component {...props} className={cnComponent} />;
  };
}
