import * as React from 'react';
import cn from 'classnames';

import Header from './Header';
import Feature from './Feature';

import { Measurer, TestBoxProps, TestBoxState } from 'src/components/modules/TestBox/types';

export const MeasurerContext = React.createContext<Measurer>({});

class TestBox extends React.PureComponent<TestBoxProps, TestBoxState> {
  public measurer: Measurer;
  public state = {
    isOpen: true,
  };

  constructor(props) {
    super(props);
    this.measurer = { measure: props.measure };
  }

  public toggleBox = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }), this.props.measure);
  }

  public getSuite = (suitePath) => suitePath.join(' / ');

  public renderFeatures = (): any => {
    const { data } = this.props;

    return data.browsers.map((item, id) => <Feature key={id} data={item} />);
  }

  public render(): JSX.Element {
    const { data, style, className } = this.props;
    const { isOpen } = this.state;

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
            {isOpen && this.renderFeatures()}
          </div>
        </div>
      </MeasurerContext.Provider>
    );
  }
}

export default TestBox;
