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
    const {
      result,
      result: { attempt },
    } = this.props.data;

    this.state = {
      isOpen: false,
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

    this.initStateFromCache();
    this.setPageCount();
  }

  public componentDidUpdate(prevProps): void {
    const { isRunning } = this.props;

    if (this.props.isOpenedBrowser !== prevProps.isOpenedBrowser) {
      this.props.measure();
    }

    if (prevProps.isRunning && !isRunning) {
      this.setPageCount();
    }
  }

  public componentWillUnmount(): void {
    this.cacheState();
  }

  public setPageCount = () => {
    const {
      result: { attempt, status },
    } = this.props.data;

    let pageCount = attempt;

    // TODO: описать условие нормально
    if (
      attempt === 0 &&
      (status === 'idle' || status === 'skipped' || status === 'running')
    ) {
      pageCount = -1;
    }

    this.setState({ pageCount });
  }

  private cacheState = () => {
    const { cache, suiteData } = this.props;
    const { isOpen, viewData, viewType, pageCurrent } = this.state;

    const suiteIndex = suiteData.suitePath.join('/');

    cache.set(`browser-${viewData.name}`, suiteIndex, {
      isOpen,
      viewType,
      pageCurrent,
    });
  }

  private initStateFromCache = () => {
    const { cache, suiteData, measure } = this.props;
    const { viewData } = this.state;
    const cacheTest = cache.data[suiteData.suitePath.join('/')];

    if (cacheTest) {
      const key = `browser-${viewData.name}`;

      if (cacheTest[key]) {
        this.setState(
          {
            isOpen: cacheTest[key].isOpen,
            viewType: cacheTest[key].viewType,
            pageCurrent: cacheTest[key].pageCurrent,
          },
          measure,
        );
      }
    }
  }

  private isScreenShot(): boolean {
    const { imagesInfo } = this.props.data.result;
    return imagesInfo.length > 0;
  }

  private handleViewChange = (viewType: TypeView): void => {
    this.setState({ viewType }, this.props.measure);
  }

  private handleDataChange = (pageNumber: number): void => {
    const { result, retries } = this.props.data;
    const { pageCount } = this.state;
    const resultPage = pageNumber === pageCount ? result : retries[pageNumber];

    this.setState({ pageCurrent: pageNumber, viewData: resultPage });
  }

  private toggleBox = () => {
    this.setState(
      (prevState: BrowserState) => ({ isOpen: !prevState.isOpen }),
      this.props.measure,
    );
  }

  private acceptBrowser = () => {
    const { viewData, pageCurrent } = this.state;
    this.props.onAccept(viewData.name, pageCurrent);
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
    const { isGui, url, status, gitUrl } = this.props;
    const { viewType, pageCurrent, pageCount, viewData, isOpen } = this.state;
    return (
      <div className={'Box-row p-0'}>
        <Header
          isGui={isGui}
          data={viewData}
          status={status}
          isOpenedBrowser={isOpen}
          onToggle={this.toggleBox}
          onAccept={this.acceptBrowser}
          handleViewChange={this.handleViewChange}
          viewType={viewType}
          handleDataChange={this.handleDataChange}
          pageCurrent={pageCurrent}
          pageCount={pageCount}
          url={url}
          gitUrl={gitUrl}
        />
        {isOpen && this.renderViewer()}
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
