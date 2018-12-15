import { ColorType } from 'src/components/ui/types';

export interface StatusProps {
  className?: string;
  name: string;
  value: number;
  color?: ColorType;
}
