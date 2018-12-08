import * as React from 'react';
import cn from 'classnames';
import { TextInputProps } from './types';

const TextInput: React.SFC<TextInputProps> = (props) => {
  const { className, placeholder, onChange } = props;
  const cnInput = cn('form-control', className);

  return (
    <input
      className={cnInput}
      type='text'
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default TextInput;
