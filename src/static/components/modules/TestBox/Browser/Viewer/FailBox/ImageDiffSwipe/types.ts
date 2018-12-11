interface IImageDiffSwipeProps {
  height?: number;
  width?: number;
  after: string;
  before: string;
  value: number;
  className?: string;
}

interface IImageDiffSwipeState {
  maxHeight: number;
  containerWidth: number;
}
