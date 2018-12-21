import { ColorType } from '../types';

export interface TextProps {
  className?: string;
  as?: 'p' | 'span' | 'strong';
  textType?: 'normal' | 'italic' | 'bold';
  textColor?: ColorType;
  textWidth?: '100' | '400' | '700';

  onClick?: (e) => any;
}
