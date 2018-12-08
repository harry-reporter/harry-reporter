import * as React from 'react';
import { MeasurerContext } from './TestBox';
import { Measurer } from 'src/components/modules/TestBox/types';

export function withMeasurer<T>(Component: React.ComponentType<T>): React.ComponentType<T & Measurer> {
  return (props) => (
    <MeasurerContext.Consumer>
      {(ctx: Measurer) => <Component {...props} {...ctx} />}
    </MeasurerContext.Consumer>
  );
}
