import * as React from 'react';
import cn from 'classnames';

import { SubNavStyled, SubNavItemStyled } from './styled';

import { IPaginationProps } from './types';

class Pagination extends React.PureComponent<IPaginationProps, {}> {
  private static defaultProps = {
    hasPreventDefault: false,
  };

  public handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { hasPreventDefault } = this.props;

    if (hasPreventDefault) {
      e.preventDefault();
    }

    const { dataset } = e.target as any;
    this.props.handleDataChange(Number(dataset.page));
  }

  /**
   * Рендер элементов по количеству страниц
   *
   */
  public renderSubNavByMaxPage = (): React.ReactNode => {
    const { pageCurrent } = this.props;

    const subNavList: React.ReactNode[] = [];

    for (let i = 0; i < this.props.pageCount + 1; i++) {
      const cnSubNav = cn('subnav-item', { selected: pageCurrent === i });

      subNavList.push(
        <SubNavItemStyled key={i} className={cnSubNav} data-page={i} href={'#'} onClick={this.handleClick}>
          {i + 1}
        </SubNavItemStyled>,
      );
    }

    return subNavList;
  }

  public render(): JSX.Element {
    return <SubNavStyled className={'subnav f6'}>{this.renderSubNavByMaxPage()}</SubNavStyled>;
  }
}

export default Pagination;
