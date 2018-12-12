import * as React from 'react';
import cn from 'classnames';

import Header from './Header';

import { Measurer, TestBoxProps, TestBoxState } from '../TestBox/types';
import { connect } from 'react-redux';
import { setIsOpenForTestBox } from '../../../store/modules/app/actions';
import { bindActionCreators } from 'redux';
import Browser from './Browser/Browser';
import { switchTestViewMod } from './testsViewMode';

export const MeasurerContext = React.createContext<Measurer>({});

class TestBox extends React.PureComponent<TestBoxProps, TestBoxState> {
  public measurer: Measurer;

  constructor(props) {
    super(props);
    this.measurer = { measure: props.measure };
  }
  public componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.isOpen !== prevProps.isOpen) {
      this.measurer.measure();
    }
  }

  public toggleBox = () => {
    this.props.setIsOpenForTestBox(!this.props.isOpen, this.props.data.uuid);
  }

  public getSuite = (suitePath) => suitePath.join(' / ');

  public renderBrowsers = (): any => {
    const { data } = this.props;

    return data.browsers.map((item) => <Browser key={item.name} data={item} />);
  }

  public render(): JSX.Element {
    const { data, style, className, isOpen } = this.props;

    const suite = this.getSuite(data.suitePath);
    const cnTestBox = cn('Box mb-3', className);

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

function mapStateToProps(state, ownProps: TestBoxProps) {
  let isOpen = state.app.isOpenPerTestBox[ownProps.data.uuid];
  if (isOpen === undefined) {
    isOpen = switchTestViewMod(state.app.testsViewMode, ownProps.data.status);
  }
  return {
    isOpen,
  };
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ setIsOpenForTestBox }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestBox);
