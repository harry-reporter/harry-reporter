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

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 160,
});

class TestsContainer extends React.PureComponent<
  TestsContainerProps,
  TestsContainerState
> {
  private renderMeasurer = (props) => ({ measure }) => {
    return (
      <TestBox
        style={props.style}
        key={props.key}
        data={this.props.tests[props.index]}
        measure={measure}
      />
    );
  }

  private renderRow = ({ index, isScrolling, key, parent, style }) => (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {this.renderMeasurer({ index, isScrolling, key, parent, style })}
    </CellMeasurer>
  )

  public renderList = ({
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
      rowHeight={cache.rowHeight}
      rowCount={this.props.tests.length}
      rowRenderer={this.renderRow}
      deferredMeasurementCache={cache}
      overscanRowCount={10}
      scrollTop={scrollTop}
      onScroll={onChildScroll}
    />
  )

  public render(): JSX.Element {
    return (
      <div className={'pt-5'}>
        <WindowScroller>{this.renderList}</WindowScroller>
      </div>
    );
  }
}

export default connect(({ tests, app }: RootStore) => ({
  tests: getTestsByType(tests.tests, tests.skips, app.selectedTestsType),
}))(TestsContainer);
