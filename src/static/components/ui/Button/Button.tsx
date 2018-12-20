import * as React from 'react';
import cn from 'classnames';

import Octicon from '@githubprimer/octicons-react';

import { ButtonProps } from './types';

const Button: React.SFC<ButtonProps> = (props) => {
  const { children = null, disabled = false, icon, className, title, isSelected, size, asLink, ...restProps } = props;
  const cnButton = cn(className, { btn: !asLink, 'btn-link': asLink, 'selected': isSelected, [`btn-${size}`]: size });

  return (
    <button {...restProps} className={cnButton} type={'button'} disabled={disabled}>
      {title || children} {icon ? <Octicon icon={icon} /> : null}
    </button>
  );
};

Button.defaultProps = {
  asLink: false,
  size: null,
};

export default Button;
