import * as React from 'react';

import { ImagesInfo, ResultViewerProps } from '../types';
import ErrorBox from '../ErrorBox/ErrorBox';
import ViewBox from './ViewBox/ViewBox';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';

class ScreenshotViewer extends React.PureComponent<ResultViewerProps> {
  public getColor() {
    const status = this.props.status;
    let color = 'gray';
    if (status === 'success') {
      color = 'green';
    }
    if (status === 'fail') {
      color = 'red';
    }
    return color;
  }
  public getViewBox(item: ImagesInfo) {
    let viewBoxWrap: any = null;
    const { measure } = this.props;
    viewBoxWrap =
      item.status === 'error' ? (
        <ErrorBox onLoad={measure} {...item} />
      ) : (
        <ViewBox onLoad={measure} {...item} />
      );

    return viewBoxWrap;
  }

  public renderViewBox = () => {
    return this.props.imagesInfo.map((item: ImagesInfo) => {
      return (
        <React.Fragment key={item.viewId}>
          {this.getViewBox(item)}
        </React.Fragment>
      );
    });
  }

  public render() {
    return <>{this.renderViewBox()}</>;
  }
}
export default withMeasurer<ResultViewerProps>(ScreenshotViewer);
