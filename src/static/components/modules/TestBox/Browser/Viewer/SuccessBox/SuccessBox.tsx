import * as React from 'react';

import './SuccessBox.css';
import { ImageInfo } from 'src/store/modules/tests/types';

class SuccessBox extends React.PureComponent<ImageInfo> {
  public render(): JSX.Element {
    const { expectedPath } = this.props;
    return (
      <>
        <div className={`Box-row Box-row--darkgray d-flex flex-justify-center`}>
          <div className={`Expected`}>
            <p className={`Title text-green text-bold`}>Expected</p>
            <img
              onLoad={this.props.onLoad}
              src={expectedPath}
              alt='Expected Test'
              className='BoxViewAsserts-Img border border-green'
            />
          </div>
        </div>
      </>
    );
  }
}

export default SuccessBox;
