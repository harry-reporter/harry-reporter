import * as React from 'react';
import cn from 'classnames';

import { NavStyled, NavItemStyled } from './styled';

import { NavigationProps, NavigationState, NavItem } from './types';

class Navigation extends React.Component<NavigationProps, NavigationState> {
  public state = {
    selectedId: null,
  };

  public componentDidMount() {
    const { dataList } = this.props;
    this.setState({ selectedId: dataList[0].name });
  }

  public handleClick = (e: any) => {
    this.setState({ selectedId: e.currentTarget.dataset.name }, () => {
      this.handleChange();
    });
  }

  public handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.selectedId);
    }
  }

  public renderItem = (data: NavItem) => {
    const { selectedId } = this.state;
    const cnItem = cn('UnderlineNav-item mr-1', { selected: selectedId === data.name });

    return (
      <NavItemStyled
        data-name={data.name}
        key={data.name}
        className={cnItem}
        onClick={this.handleClick}
      >
        {data.component}
      </NavItemStyled>
    );
  }

  public render(): JSX.Element {
    const { dataList, className } = this.props;
    const cnNav = cn('UnderlineNav flex-item-start flex-justify-start', className);

    return (
      <NavStyled className={cnNav}>
        {dataList.map((item) => this.renderItem(item))}
      </NavStyled>
    );
  }
}

export default Navigation;
