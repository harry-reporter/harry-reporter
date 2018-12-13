import * as React from 'react';

import Viewer from './Viewer';
import Header from './Header';

import { FeatureProps, FeatureState } from './types';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';

// TODO: вынести функциионал по аккордеону в отдельную компоненту
class Feature extends React.PureComponent<FeatureProps, FeatureState> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      viewType: this.props.data.result.imagesInfo.length > 0 ? 'screenshot' : 'code',
      viewData: this.props.data.result,
      pageCount: this.props.data.result.attempt,
      pageCurrent: this.props.data.result.attempt,
    };
  }

  public componentDidMount(): void {
    const { viewData } = this.state;
    this.setState({
      isOpen: viewData.status === 'fail',
    }, this.props.measure);
  }

  public toggleFeature = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }), this.props.measure);
  }

  public handleViewChange = (e: string) => {
    this.setState({ viewType: e }, this.props.measure);
  }

  public handleDataChange = (e: number) => {
    if (e === this.state.pageCount) {
      this.setState({ pageCurrent: e, viewData: this.props.data.result });
    } else {
      this.setState({ pageCurrent: e, viewData: this.props.data.retries[e] });
    }
  }

  public render(): JSX.Element {
    const { name } = this.props.data;
    const { status } = this.state.viewData;
    const { viewType, pageCurrent, pageCount, viewData, isOpen } = this.state;

    return (
      <div className={'Box-row p-0'}>
        <Header
          data={viewData}
          title={name}
          isOpenedFeature={isOpen}
          status={status}
          onToggle={this.toggleFeature}
          handleViewChange={this.handleViewChange}
          viewType={viewType}
          handleDataChange={this.handleDataChange}
          pageCurrent={pageCurrent}
          pageCount={pageCount}
        />
        {isOpen && <Viewer type={viewType} {...viewData} />}
      </div>
    );
  }
}

export default withMeasurer(Feature);
