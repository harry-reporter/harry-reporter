import * as React from 'react';
import cn from 'classnames';

type Value = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface PaddingProps {
  mt?: Value;
  mr?: Value;
  mb?: Value;
  ml?: Value;
  m?: Value;

  className?: string;
}

function getMargin(name: string, value: Value) {
  return { [`${name}-${value}`]: value || false };
}

// TODO: объединить с withPadding
export function withMargin<P>(
  Component: React.ComponentType<P & PaddingProps>,
): React.ComponentType<P & PaddingProps> {
  return (props: PaddingProps) => {
    const { m = 0, mt = 0, mr = 0, mb = 0, ml = 0, className = '' } = props;

    const cnComponent = cn(className, {
      ...getMargin('mt', mt),
      ...getMargin('mr', mr),
      ...getMargin('mb', mb),
      ...getMargin('ml', ml),
      ...getMargin('m', m),
    });

    return <Component {...props} className={cnComponent} />;
  };
}
