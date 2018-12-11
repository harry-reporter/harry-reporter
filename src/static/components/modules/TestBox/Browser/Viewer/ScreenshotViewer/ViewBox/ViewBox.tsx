import * as React from 'react';
import { ImagesInfo } from '../../types';
import Header from '../Header/Header';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import FailBox from '../../FailBox/FailBox';
import SuccessBox from '../../SuccessBox/SuccessBox';
import { setIsOpenForView } from 'src/store/modules/app/actions';
import { switchTestViewMod } from 'src/components/modules/TestBox/testsViewMode';

class ViewBox extends React.PureComponent<ImagesInfo> {
  public componentDidUpdate(prevProps): void {
    if (prevProps) {
      if (this.props.isOpenedScreenView !== prevProps.isOpenedScreenView) {
        this.props.measure();
      }
    }
  }

  public getColor() {
    const { status } = this.props;

    let color = 'gray';
    if (status === 'success') {
      color = 'green';
    }
    if (status === 'fail') {
      color = 'red';
    }
    return color;
  }
  public getBox(): JSX.Element {
    const {
      measure,
      isOpenedScreenView,
      setIsOpenForView,
      status,
    } = this.props;
    let box: JSX.Element = (
      <SuccessBox
        onLoad={measure}
        {...this.props}
        isOpenedScreenView={isOpenedScreenView}
        setIsOpenForView={setIsOpenForView}
      />
    );
    if (status === 'fail') {
      box = (
        <FailBox
          onLoad={measure}
          {...this.props}
          isOpenedScreenView={isOpenedScreenView}
          setIsOpenForView={setIsOpenForView}
        />
      );
    }
    return box;
  }
  public toggleBox = () => {
    this.props.setIsOpenForView(
      !this.props.isOpenedScreenView,
      this.props.viewId,
    );
  }
  public render() {
    const { stateName, isOpenedScreenView } = this.props;
    return (
      <>
        <Header
          color={this.getColor()}
          stateName={stateName}
          isOpen={isOpenedScreenView}
          onClick={setIsOpenForView}
          onToggle={this.toggleBox}
        />
        {isOpenedScreenView && this.getBox()}
      </>
    );
  }
}

function mapStateToProps(state, ownProps: ImagesInfo) {
  let isOpenedScreenView = state.app.isOpenPerView[ownProps.viewId];
  if (isOpenedScreenView === undefined) {
    isOpenedScreenView = switchTestViewMod(state.app.testsViewMode);
  }

  return {
    isOpenedScreenView,
  };
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ setIsOpenForView }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMeasurer<ImagesInfo>(ViewBox));
