import * as React from 'react';
import { DropdownItemProps } from './types';

const DropdownItem: React.SFC<DropdownItemProps> = (props) => {
  const { className, title, url, onClick } = props;

  return (
    <li>
      <a className='dropdown-item' href={url} onClick={onClick}>
        {title}
      </a>
    </li>
  );
};

export default DropdownItem;
