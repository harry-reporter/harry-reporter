import { ColorType } from '../types';

export interface TextProps {
  className?: string;
  as?: 'p' | 'span' | 'strong';
  textType?: 'normal' | 'italic' | 'bold';
  textColor?: ColorType;

  onClick?: (e) => any;
}
