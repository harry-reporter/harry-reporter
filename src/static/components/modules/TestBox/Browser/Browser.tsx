import * as React from 'react';

import Viewer from './Viewer';
import Header from './Header';

import { BrowserProps, BrowserState } from './types';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';
import { connect } from 'react-redux';
import { setIsOpenForBrowser } from 'src/store/modules/app/actions';
import { bindActionCreators } from 'redux';
import { switchTestViewMod } from '../testsViewMode';

// TODO: вынести функциионал по аккордеону в отдельную компоненту

class Browser extends React.PureComponent<BrowserProps, BrowserState> {
  constructor(props) {
    super(props);
    this.state = {
      viewType:
        this.props.data.result.imagesInfo.length > 0 ? 'screenshot' : 'code',
      viewData: this.props.data.result,
      pageCount: this.props.data.result.attempt,
      pageCurrent: this.props.data.result.attempt,
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
    if (e === this.state.pageCount) {
      this.setState({ pageCurrent: e, viewData: this.props.data.result });
    } else {
      this.setState({ pageCurrent: e, viewData: this.props.data.retries[e] });
    }
  }
  public toggleBox = () => {
    this.props.setIsOpenForBrowser(
      !this.props.isOpenedBrowser,
      this.props.data.browsersId,
    );
  }

  public render(): JSX.Element {
    const { url, isOpenedBrowser } = this.props;
    const { name } = this.props.data;
    const { status } = this.state.viewData;
    const { viewType, pageCurrent, pageCount, viewData } = this.state;

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

function mapStateToProps(state, ownProps: BrowserProps) {
  let isOpenedBrowser = state.app.isOpenPerBrowser[ownProps.data.browsersId];
  if (isOpenedBrowser === undefined) {
    isOpenedBrowser = switchTestViewMod(
      state.app.testsViewMode,
      ownProps.data.status,
    );
  }
  return {
    isOpenedBrowser,
    url: state.app.url,
  };
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ setIsOpenForBrowser }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMeasurer<BrowserProps>(Browser));
