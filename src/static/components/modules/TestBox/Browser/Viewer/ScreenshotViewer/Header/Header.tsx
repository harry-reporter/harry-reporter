import * as React from 'react';
import cn from 'classnames';

import { HeaderProps } from './types';

import Link from 'src/components/ui/Link/Link';

export default class Header extends React.PureComponent<HeaderProps> {
  private handleClickAtHeader = (e) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      this.props.onToggle();
    }
  }

  private cnHeader = cn(
    this.props.className,
    'Box Box-row Box--condensed Box-header d-flex flex-justify-between',
  );

  public render() {
    const { stateName, isOpen, color } = this.props;
    return (
      <div className={this.cnHeader} onClick={this.handleClickAtHeader}>
        <h4 className={`Title Box-title text-${color}`}>{stateName}</h4>
        <Link
          className={'Link flex-justify-end'}
          url=''
          onClick={this.handleClickAtHeader}
        >
          {isOpen ? 'Hide' : 'Show'}
        </Link>
      </div>
    );
  }
}
