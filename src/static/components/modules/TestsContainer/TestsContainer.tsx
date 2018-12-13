import * as React from 'react';
import { connect } from 'react-redux';
import { getTestsByType } from './selectors';

import {
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from 'react-virtualized';
import TestBox from '../TestBox';
import { ListStyled } from './styled';

import { RootStore } from '../../../store/types/store';
import { TestsContainerProps, TestsContainerState } from './types';
import { TestBoxesCache } from 'src/components/modules/TestBox/utils';

const measurerCache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 160,
});
const testBoxesCache = new TestBoxesCache();

class TestsContainer extends React.PureComponent<
  TestsContainerProps,
  TestsContainerState
> {
  private renderMeasurer = ({ style, index, key }) => ({ measure }) => {
    const { tests } = this.props;
    const testBoxIndex = `${tests[index].name}-${key}`;

    return (
      <TestBox
        cache={testBoxesCache}
        style={style}
        index={testBoxIndex}
        key={testBoxIndex}
        data={tests[index]}
        measure={measure}
      />
    );
  }

  private renderRow = ({ index, isScrolling, key, parent, style }) => (
    <CellMeasurer
      cache={measurerCache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {this.renderMeasurer({ style, index, key })}
    </CellMeasurer>
  )

  private renderList = () => ({
    height,
    width,
    isScrolling,
    onChildScroll,
    scrollTop,
  }) => (
    <ListStyled
      autoHeight={true}
      autoWidth={true}
      isScrolling={isScrolling}
      scrollToAlignment={'center'}
      height={height}
      width={width}
      rowHeight={measurerCache.rowHeight}
      rowCount={this.props.tests.length}
      rowRenderer={this.renderRow}
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
        <WindowScroller>{this.renderList()}</WindowScroller>
      </div>
    );
  }
}

export default connect((state: RootStore) => ({
  tests: getTestsByType(state),
}))(TestsContainer);
