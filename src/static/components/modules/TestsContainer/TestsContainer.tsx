import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTestsByType } from './selectors';

import { CellMeasurer, CellMeasurerCache, WindowScroller } from 'react-virtualized';
import TestBox from '../TestBox';
import { ListStyled } from './styled';

import * as testsActions from 'src/store/modules/tests/actions';
import clientEvents from '../../../../gui/constants/client-events';

import { RootStore } from 'src/store/types/store';
import { TestsContainerProps, TestsContainerState } from './types';
import { TestBoxesCache } from 'src/components/modules/TestBox/utils';

const measurerCache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 160,
});
const testBoxesCache = new TestBoxesCache();

class TestsContainer extends React.Component<TestsContainerProps, TestsContainerState> {

  public componentDidMount() {
    if (this.props.gui) {
      this.subscribeToEvents();
    }
  }

  private subscribeToEvents() {
    const { suiteBegin, testBegin, testResult, testsEnd } = this.props;
    const eventSource = new EventSource('/events');

    eventSource.addEventListener(clientEvents.BEGIN_SUITE, (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);
      suiteBegin(data);
    });

    eventSource.addEventListener(clientEvents.BEGIN_STATE, (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);
      testBegin(data);
    });

    [clientEvents.TEST_RESULT, clientEvents.ERROR].forEach((eventName) => {
      eventSource.addEventListener(eventName, (ev: MessageEvent) => {
        const data = JSON.parse(ev.data);
        testResult(data);
      });
    });

    eventSource.addEventListener(clientEvents.END, () => testsEnd());
  }

  private renderList = () => ({ height, width, isScrolling, onChildScroll, scrollTop }) => (
    <ListStyled
      autoHeight={true}
      autoWidth={true}
      isScrolling={isScrolling}
      scrollToAlignment={'center'}
      height={height}
      width={width}
      rowHeight={measurerCache.rowHeight}
      rowCount={this.props.tests.length}
      rowRenderer={({ index, key, parent, style }) => (
        <CellMeasurer
          cache={measurerCache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
        >
          {({ measure }) => {
            const { tests, selectedTestsType, gui } = this.props;
            const testBoxIndex = `${tests[index].suitePath.join(' ')}`;

            return (
              <TestBox
                isGui={gui}
                cache={testBoxesCache}
                style={style}
                index={testBoxIndex}
                key={testBoxIndex}
                data={tests[index]}
                measure={measure}
                selectedTestsType={selectedTestsType}
              />
            );
          }}
        </CellMeasurer>
      )}
      deferredMeasurementCache={measurerCache}
      overscanRowCount={10}
      scrollTop={scrollTop}
      onScroll={onChildScroll}
    />
  )

  public render(): JSX.Element {
    const { tests } = this.props;

    if (tests.length === 0) {
      return null;
    }
    return (
      <div className={'pt-5'}>
        <WindowScroller>
          {this.renderList()}
        </WindowScroller>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  ...testsActions,
}, dispatch);

export default connect((state: RootStore) => ({
  tests: getTestsByType(state),
  selectedTestsType: state.app.selectedTestsType,
  gui: state.tests.gui,
}), mapDispatchToProps)(TestsContainer);
