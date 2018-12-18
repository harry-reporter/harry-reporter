import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ImageInfo } from 'src/store/modules/tests/types';
import { setIsOpenForView } from 'src/store/modules/app/actions';
import { RootStore } from 'src/store/types/store';
import { viewSelector } from './selector';
import { getColor } from './../../../../common-utils';

import Header from '../Header/Header';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';
import FailBox from '../../FailBox/FailBox';
import SuccessBox from '../../SuccessBox/SuccessBox';

class ViewBox extends React.Component<ImageInfo> {
  public componentDidUpdate(prevProps): void {
    if (this.props.isOpenedScreenView !== prevProps.isOpenedScreenView) {
      this.props.measure();
    }
  }

  private toggleBox = () => {
    this.props.setIsOpenForView(
      !this.props.isOpenedScreenView,
      this.props.viewId,
    );
  }

  private getBox(): JSX.Element {
    const {
      measure,
      isOpenedScreenView,
      setIsOpenForView: setOpenForView,
      status,
    } = this.props;

    const boxAttr = {
      onLoad: measure,
      'isOpenedScreenView': isOpenedScreenView,
      'setIsOpenForView': setOpenForView,
    };

    // todo: не могу использовать isFailedTest - принимает suite, а в этом контексте ImageInfo
    const Box: JSX.Element = status !== 'fail' ?
      <SuccessBox {...boxAttr}{...this.props} /> : <FailBox {...boxAttr}{...this.props} />;

    return (Box);
  }

  public render() {
    const { stateName, isOpenedScreenView, status } = this.props;
    return (
      <>
        <Header
          color={getColor(status)}
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

function mapStateToProps(store: RootStore, ownProps: ImageInfo) {
  return viewSelector(store, ownProps);
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ setIsOpenForView }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMeasurer<ImageInfo>(ViewBox));
