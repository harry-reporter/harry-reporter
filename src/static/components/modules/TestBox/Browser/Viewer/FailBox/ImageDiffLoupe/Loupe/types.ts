interface ILoupeProps {
  src: string;
  width?: number;
  height?: number;
  zoom: number;
  left?: string;
  top?: string;
  x: number;
  y: number;
  onMove: (e) => void;
  ref?: any;
}
