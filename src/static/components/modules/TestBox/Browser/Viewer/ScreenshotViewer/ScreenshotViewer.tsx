import * as React from 'react';

import { Attempt, ImageInfo } from 'src/store/modules/tests/types';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';

import ErrorBox from '../ErrorBox/ErrorBox';
import ViewBox from './ViewBox/ViewBox';

class ScreenshotViewer extends React.PureComponent<Attempt> {

  public renderScreen(item: ImageInfo) {
    const { measure } = this.props;
    return item.status === 'error' ? <ErrorBox onLoad={measure} {...item} /> : <ViewBox onLoad={measure} {...item} />;
  }

  public renderViewBox = () => {
    const { imagesInfo } = this.props;
    if (imagesInfo.length === 0) {
      return (
        <div className={`Box-row Box-row--darkgray d-flex flex-justify-center`}>
          <span className='text-green'>Ошибок не обнаружено</span>
        </div>
      );
    }
    return this.props.imagesInfo.map((item: ImageInfo) => {
      return (
        <React.Fragment key={item.viewId}>
          {this.renderScreen(item)}
        </React.Fragment>
      );
    });
  }

  public render() {
    return <>{this.renderViewBox()}</>;
  }
}
export default withMeasurer<Attempt>(ScreenshotViewer);
