interface IImageDiffSwipeProps {
  height?: number;
  width?: number;
  after: string;
  before: string;
  value: number;
  className?: string;
  measure?: any;
}

interface IImageDiffSwipeState {
  maxHeight: number;
  containerWidth: number;
}
