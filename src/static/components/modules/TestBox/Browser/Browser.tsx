import * as React from 'react';

import Header from './Header';
import CodeViewer from './Viewer/CodeViewer';
import ScriptViewer from './Viewer/ScriptViewer';
import ScreenshotViewer from './Viewer/ScreenshotViewer';

import { BrowserProps, BrowserState } from './types';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';
import { connect } from 'react-redux';
import { setIsOpenForBrowser } from 'src/store/modules/app/actions';
import { bindActionCreators } from 'redux';
import { RootStore } from 'src/store/types/store';
import { browserSelector } from './selector';
import { TypeView } from 'src/store/modules/tests/types';

// TODO: вынести функциионал по аккордеону в отдельную компоненту

class Browser extends React.Component<BrowserProps, BrowserState> {
  private screenshot: TypeView = 'screenshot';
  private code: TypeView = 'code';
  constructor(props) {
    super(props);
    const { result, result: { attempt } } = this.props.data;

    this.state = {
      viewData: result,
      viewType: this.screenshot,
      pageCount: attempt,
      pageCurrent: attempt,
    };
  }

  public componentDidMount(): void {
    if (!this.isScreenShot()) {
      this.setState({ viewType: this.code });
    }
  }

  public componentDidUpdate(prevProps): void {
    if (this.props.isOpenedBrowser !== prevProps.isOpenedBrowser) {
      this.props.measure();
    }
  }

  private isScreenShot(): boolean {
    const { imagesInfo } = this.props.data.result;
    return imagesInfo.length > 0;
  }

  private handleViewChange = (viewType: TypeView): void => {
    this.setState({ viewType });
  }

  private handleDataChange = (pageNumber: number): void => {
    const { result, retries } = this.props.data;
    const { pageCount } = this.state;
    const resultPage = pageNumber === pageCount ? result : retries[pageNumber];
    this.setState({ pageCurrent: pageNumber, viewData: resultPage });
  }

  private toggleBox = () => {
    const { isOpenedBrowser } = this.props;
    const browsersId = this.props.data.browserId;
    this.props.setIsOpenForBrowser(!isOpenedBrowser, browsersId);
  }

  private renderViewer(): JSX.Element {
    let ViewerWrapper = null;
    const { viewType, viewData } = this.state;
    switch (viewType) {
      case 'code':
        ViewerWrapper = CodeViewer;
        break;
      case 'tests':
        ViewerWrapper = ScriptViewer;
        break;
      case 'screenshot':
        ViewerWrapper = ScreenshotViewer;
        break;
    }
    return <ViewerWrapper {...viewData} />;
  }

  public render(): JSX.Element {
    const { url, isOpenedBrowser } = this.props;
    const { viewType, pageCurrent, pageCount, viewData } = this.state;
    return (
      <div className={'Box-row p-0'}>
        <Header
          data={viewData}
          isOpenedBrowser={isOpenedBrowser}
          onToggle={this.toggleBox}
          handleViewChange={this.handleViewChange}
          viewType={viewType}
          handleDataChange={this.handleDataChange}
          pageCurrent={pageCurrent}
          pageCount={pageCount}
          url={url}
        />
        {isOpenedBrowser && this.renderViewer()}
      </div>
    );
  }
}

function mapStateToProps(store: RootStore, ownProps: BrowserProps) {
  return browserSelector(store, ownProps);
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ setIsOpenForBrowser }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMeasurer<BrowserProps>(Browser));
