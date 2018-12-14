import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';

import { hasRetries, isFailedTest } from 'src/utils';
import { testBoxSelector } from '../TestBox/selector';
import { Measurer, TestBoxProps, TestBoxState } from 'src/components/modules/TestBox/types';
import { RootStore } from 'src/store/types/store';
import { TestsViewMode } from 'src/store/modules/app/types';
import { setIsOpenForTestBox } from 'src/store/modules/app/actions';
import { acceptTest } from 'src/store/modules/tests/actions';

import Header from './Header';
import Browser from './Browser/Browser';

export const MeasurerContext = React.createContext<Measurer>({});

class TestBox extends React.Component<TestBoxProps, TestBoxState> {
  private measurer: Measurer;
  public state = {
    isOpen: true,
  };

  public static getDerivedStateFromProps({
    testsViewMode,
    data,
  }: TestBoxProps) {
    switch (testsViewMode) {
      case TestsViewMode.expandAll:
        return { isOpen: true };

      case TestsViewMode.collapseAll:
        return { isOpen: false };

      case TestsViewMode.expandErrors:
        return { isOpen: isFailedTest(data) };

      case TestsViewMode.expandRetries:
        return { isOpen: hasRetries(data) };

      default:
        return null;
    }
  }

  constructor(props) {
    super(props);
    this.measurer = { measure: props.measure };
  }

  public componentDidUpdate(prevProps: TestBoxProps): void {
    const { isOpen, measure } = this.props;
    if (isOpen !== prevProps.isOpen) {
      measure();
    }
  }

  public componentDidMount(): void {
    const { cache, index, measure } = this.props;
    const cacheTest = cache.data[index];
    if (cacheTest) {
      this.setState({ isOpen: cacheTest.isOpen }, measure);
    }
  }

  public componentWillUnmount(): void {
    const { cache, index } = this.props;
    const { isOpen } = this.state;

    cache.set('isOpen', index, isOpen);
  }

  private toggleBox = () => {
    this.props.setIsOpenForTestBox(!this.props.isOpen, this.props.data.uuid);
  }

  private acceptTest = (browserId, attempt, stateName) => {
    const { data, acceptTest } = this.props;
    acceptTest(data, browserId, attempt, stateName);
  }

  private renderBrowsers = (): any => {
    const { data, isGui } = this.props;

    return data.browsers.map((item) => (
      <Browser
        key={item.name}
        isGui={isGui}
        data={item}
        onAccept={this.acceptTest}
      />
    ));
  }

  public render(): JSX.Element {
    const { data, style, className, isOpen } = this.props;
    const suite = data.suitePath.join(' / ');
    const cnTestBox = cn('Box mb-3 mt-1', className);

    return (
      <MeasurerContext.Provider value={this.measurer}>
        <div style={style}>
          <div className={cnTestBox}>
            <Header
              title={suite}
              status={data.status}
              isOpenedBox={isOpen}
              onToggle={this.toggleBox}
            />
            {isOpen && this.renderBrowsers()}
          </div>
        </div>
      </MeasurerContext.Provider>
    );
  }
}

const mapStateToProps = (store: RootStore, ownProps: TestBoxProps) => ({
  isOpen: testBoxSelector(store, ownProps),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setIsOpenForTestBox,
    acceptTest,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestBox);
