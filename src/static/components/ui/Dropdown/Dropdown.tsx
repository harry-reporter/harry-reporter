import * as React from 'react';
import cn from 'classnames';
import { DropdownProps } from './types';

import './styles.css';

const Dropdown: React.SFC<DropdownProps> = (props) => {
  const { children = null, className, title, isOpened } = props;
  const cnDropdownItem = cn(
    'dropdown details-reset details-overlay d-inline-block',
    className,
  );

  return (
    <details className={cnDropdownItem}>
      <summary className='btn' aria-haspopup='true'>
        {title}
        <div className='dropdown-caret' />
      </summary>

      <ul className='dropdown-menu dropdown-menu-se'>{props.children}</ul>
    </details>
  );
};

Dropdown.defaultProps = {
  isOpened: false,
};

export default Dropdown;
