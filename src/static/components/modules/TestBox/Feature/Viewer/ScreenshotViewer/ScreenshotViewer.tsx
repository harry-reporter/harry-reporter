import * as React from 'react';

import { ImagesInfo, ResultViewerProps } from '../types';
import SuccessBox from '../SuccessBox/SuccessBox';
import FailBox from '../FailBox/FailBox';
import Link from 'src/components/ui/Link/Link';
import ErrorBox from '../ErrorBox/ErrorBox';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';

interface ScreenshotViewerState {
  isOpen: boolean;
}

class ScreenshotViewer extends React.PureComponent<ResultViewerProps, ScreenshotViewerState> {
  constructor(props: ResultViewerProps) {
    super(props);
    this.state = { isOpen: this.props.status !== 'success' };
  }

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

    switch (item.status) {
      case 'success':
        viewBoxWrap = this.getSuccessBoxTemplate(item, <SuccessBox onLoad={this.props.measure} {...item} />);
        break;
      case 'fail':
        viewBoxWrap = this.getSuccessBoxTemplate(item, <FailBox onLoad={this.props.measure} {...item} />);
        break;
      case 'error':
        viewBoxWrap = <ErrorBox  onLoad={this.props.measure} {...item} />;
        break;
      default:
        viewBoxWrap = this.getSuccessBoxTemplate(item, <SuccessBox  onLoad={this.props.measure} {...item} />);
    }

    return viewBoxWrap;
  }

  public getSuccessBoxTemplate(item: ImagesInfo, viewBoxWrap: JSX.Element) {
    return (
      <>
        <div className={'Box Box-row Box--condensed Box-header d-flex flex-justify-between'}>
          <h4 className={`Title Box-title text-${this.getColor()}`}>{item.stateName}</h4>
          <Link className={'Link flex-justify-end'} url='' onClick={this.onLinkClick}>
            {this.state.isOpen ? 'Hide' : 'Show'}
          </Link>
        </div>
        <div className={`Box-detail${this.state.isOpen ? '' : '_isHidden'}`}>{viewBoxWrap}</div>
      </>
    );
  }

  public renderViewBox = () => {
    return this.props.imagesInfo.map((item: ImagesInfo, id: number) => {
      return <React.Fragment key={id}>{this.getViewBox(item)}</React.Fragment>;
    });
  }

  public render() {
    return <>{this.renderViewBox()}</>;
  }
  public onLinkClick = (e) => {
    e.preventDefault();
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }), this.props.measure);
  }
}

export default withMeasurer<ResultViewerProps>(ScreenshotViewer);
