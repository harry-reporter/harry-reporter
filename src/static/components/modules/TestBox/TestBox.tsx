import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import * as appActions from 'src/store/modules/app/actions';
import { hasRetries, isFailedTest } from 'src/utils';

import Header from './Header';
import Feature from './Feature';

import { Measurer, TestBoxProps, TestBoxState } from 'src/components/modules/TestBox/types';
import { RootStore } from 'src/store/types/store';
import { TestsViewMode } from 'src/store/modules/app/types';

export const MeasurerContext = React.createContext<Measurer>({});

class TestBox extends React.Component<TestBoxProps, TestBoxState> {
  private measurer: Measurer;
  public state = {
    isOpen: true,
  };

  public static getDerivedStateFromProps({ testsViewMode, data }: TestBoxProps) {
    switch (testsViewMode) {
      case TestsViewMode.expandAll:
        return { isOpen: true };

      case TestsViewMode.collapseAll:
        return { isOpen: false };

      case TestsViewMode.expandErrors:
        return { isOpen: isFailedTest(data) };

      case TestsViewMode.expandRetries:
        return { isOpen: hasRetries(data) };

      default: return null;
    }
  }

  constructor(props) {
    super(props);
    this.measurer = { measure: props.measure };
  }

  public componentDidMount(): void {
    const { cache, index, measure } = this.props;
    const cacheTest = cache.data[index];

    if (cacheTest) {
      this.setState({ isOpen: cacheTest.isOpen }, measure);
    }
  }

  public componentDidUpdate(prevProps: TestBoxProps): void {
    const { testsViewMode, measure } = this.props;

    if (testsViewMode !== prevProps.testsViewMode) {
      measure();
    }
  }

  public componentWillUnmount(): void {
    const { cache, index } = this.props;
    const { isOpen } = this.state;

    cache.set('isOpen', index, isOpen);
  }

  private toggleBox = () => {
    const { testsViewMode, measure, setTestsViewMode } = this.props;

    this.setState((prevState) => ({ isOpen: !prevState.isOpen }), measure);
    if (testsViewMode !== TestsViewMode.none) {
      setTestsViewMode(TestsViewMode.none);
    }
  }

  private renderFeatures = (): any => {
    const { data } = this.props;

    return data.browsers.map((item) => <Feature key={item.name} data={item} />);
  }

  public render(): JSX.Element {
    const { data, style, className } = this.props;
    const { isOpen } = this.state;

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
            {isOpen && this.renderFeatures()}
          </div>
        </div>
      </MeasurerContext.Provider>
    );
  }
}

const mapStateToProps = ({ app }: RootStore) => ({
  testsViewMode: app.testsViewMode,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(appActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TestBox);
