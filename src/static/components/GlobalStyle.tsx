import * as React from 'react';
import GS from '../theme/global-style';

class GlobalStyle extends React.PureComponent<{}, {}> {
  public render(): JSX.Element {
    return <GS />;
  }
}

export default GlobalStyle;
