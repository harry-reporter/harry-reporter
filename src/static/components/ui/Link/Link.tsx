import * as React from 'react';
import classnames from 'classnames';

interface ILinkProps {
  className?: string;
  color?: string;
  url?: string;
  onClick?: (e) => void;
}

const Link: React.SFC<ILinkProps> = ({ ...props }) => {
  const getColor = () => {
    return props.color ? `text-${props.color}` : '';
  };
  const cnText = classnames(props.className, getColor());
  const getUrl = () => {
    return props.url === '' ? '' : props.url ? props.url : '#';
  };
  return (
    <a href={getUrl()} className={cnText} onClick={props.onClick}>
      {props.children}
    </a>
  );
};

export default Link;
