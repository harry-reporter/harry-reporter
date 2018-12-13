import * as React from 'react';

import Viewer from './Viewer';
import Header from './Header';

import { BrowserProps, BrowserState } from './types';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';
import { connect } from 'react-redux';
import { setIsOpenForBrowser } from 'src/store/modules/app/actions';
import { bindActionCreators } from 'redux';
import { switchTestViewMod } from '../testsViewMode';
import { RootStore } from 'src/store/types/store';

// TODO: вынести функциионал по аккордеону в отдельную компоненту

class Browser extends React.PureComponent<BrowserProps, BrowserState> {
  constructor(props) {
    super(props);
    const screenshot = 'screenshot';
    const code = 'code';

    const {
      result,
      result: { attempt, imagesInfo },
    } = this.props.data;
    this.state = {
      viewType: imagesInfo.length > 0 ? screenshot : code,
      viewData: result,
      pageCount: attempt,
      pageCurrent: attempt,
    };
  }

  public componentDidUpdate(prevProps): void {
    if (prevProps) {
      if (this.props.isOpenedBrowser !== prevProps.isOpenedBrowser) {
        this.props.measure();
      }
    }
  }

  public handleViewChange = (e: string) => {
    this.setState({ viewType: e });
  }

  public handleDataChange = (e: number) => {
    const { result, retries } = this.props.data;
    const { pageCount } = this.state;
    if (e === pageCount) {
      this.setState({ pageCurrent: e, viewData: result });
    } else {
      this.setState({ pageCurrent: e, viewData: retries[e] });
    }
  }
  public toggleBox = () => {
    const {
      isOpenedBrowser,
      data: { browsersId },
    } = this.props;
    this.props.setIsOpenForBrowser(!isOpenedBrowser, browsersId);
  }

  public render(): JSX.Element {
    const {
      url,
      isOpenedBrowser,
      data: { name },
    } = this.props;

    const {
      viewType,
      pageCurrent,
      pageCount,
      viewData,
      viewData: { status },
    } = this.state;

    return (
      <div className={'Box-row p-0'}>
        <Header
          data={viewData}
          title={name}
          isOpenedBrowser={isOpenedBrowser}
          status={status}
          onToggle={this.toggleBox}
          handleViewChange={this.handleViewChange}
          viewType={viewType}
          handleDataChange={this.handleDataChange}
          pageCurrent={pageCurrent}
          pageCount={pageCount}
          url={url}
        />
        {isOpenedBrowser && <Viewer type={viewType} {...viewData} />}
      </div>
    );
  }
}

function mapStateToProps({ app }: RootStore, ownProps: BrowserProps) {
  let isOpenedBrowser = app.isOpenPerBrowser[ownProps.data.browsersId];
  if (isOpenedBrowser === undefined) {
    isOpenedBrowser = switchTestViewMod(
      app.testsViewMode,
      ownProps.data.status,
    );
  }
  return {
    isOpenedBrowser,
    url: app.url,
  };
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ setIsOpenForBrowser }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMeasurer<BrowserProps>(Browser));
