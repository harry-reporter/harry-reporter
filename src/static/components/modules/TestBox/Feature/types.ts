import { Browser } from 'src/store/modules/tests/types';
import { ResultViewerProps } from './Viewer/types';

export interface FeatureProps {
  data: any;
  url: string;

  measure?: () => any;
}
export interface FeatureState {
  isOpen: boolean;
  viewType: string;
  viewData: ResultViewerProps;
  pageCount: number;
  pageCurrent: number;
}
