import * as React from 'react';

import './types';
import './ImageDiffOnionSkin.css';

export default class ImageDiffOnionSkin extends React.Component<IImageDiffOnionSkin> {
  public render() {
    const { value, before, after } = this.props;
    const beforeStyle = {
      opacity: value,
    };

    const afterStyle = {
      opacity: 1 - value,
    };

    return (
      <div className='ImageDiffSwipe'>
        <div className='ImageDiffSwipe__inner'>
          <div className='ImageDiffSwipe__before ' style={beforeStyle}>
            <img src={before} className='ImageDiffSwipe__imgBefore border border-green' />
          </div>
          <div className='ImageDiffSwipe__after ' style={afterStyle}>
            <img src={after} className='ImageDiffSwipe__imgAfter border border-red' />
          </div>
        </div>
      </div>
    );
  }
}
