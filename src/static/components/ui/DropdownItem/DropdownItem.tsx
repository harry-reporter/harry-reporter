import * as React from 'react';
import { DropdownItemProps } from './types';

const DropdownItem: React.SFC<DropdownItemProps> = (props) => {
  const { className, title, onClick, value } = props;

  const handleClick = () => onClick(value);

  return (
    <li><a className='dropdown-item' onClick={handleClick}>{title}</a></li>
  );
};

export default DropdownItem;
