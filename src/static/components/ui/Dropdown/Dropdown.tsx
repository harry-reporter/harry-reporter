import * as React from 'react';
import cn from 'classnames';
import DropdownItem from '../DropdownItem';
import { DropdownProps } from './types';

import './styles.css';

class Dropdown extends React.PureComponent<DropdownProps> {

  public state = {
    isOpen: false,
    value: '',
  };

  public toggleOpen = (ev) => {
    ev.preventDefault();
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  public handleClickAtItem = (value: string) => {
    this.setState({ value, isOpen: false }, () => this.props.onChange(value));
  }

  public renderItems() {
    const { items} = this.props;
    return items.map(({ title: itemTitle, value }, key) => {
      return <DropdownItem title={itemTitle} key={key} value={value} onClick={this.handleClickAtItem} />;
    });
  }

  public render() {
    const { className, title } = this.props;
    const { isOpen } = this.state;
    const cnDropdownItem = cn('dropdown details-reset details-overlay d-inline-block', className);

    return (
      <details className={cnDropdownItem} onClick={this.toggleOpen} open={isOpen}>
        <summary className='btn' aria-haspopup='true'>
          {title}
          <div className='dropdown-caret' />
        </summary>
        <ul className='dropdown-menu dropdown-menu-se'>
          {this.renderItems()}
        </ul>
      </details>
    );
  }
}

export default Dropdown;
