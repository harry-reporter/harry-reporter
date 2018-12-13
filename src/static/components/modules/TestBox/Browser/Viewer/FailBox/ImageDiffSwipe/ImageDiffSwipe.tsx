import * as React from 'react';

import './types';
import './ImageDiffSwipe.css';

export default class ImageDiffSwipe extends React.Component<IImageDiffSwipeProps, IImageDiffSwipeState> {
  public containerRef;
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      maxHeight: 0,
      containerWidth: 0,
    };
  }
  public componentDidMount() {
    this.setState({ containerWidth: this.containerRef.current.clientWidth });
  }

  public imgLoadHandler = (e) => {
    let imgWidth = e.target.clientWidth;
    if (imgWidth > this.state.containerWidth) {
      imgWidth = this.state.containerWidth;
      e.target.style.width = imgWidth + 'px';
    }
    const imgHeight = e.target.clientHeight;
    this.setState(({ maxHeight }) => ({ maxHeight: Math.max(maxHeight, imgHeight) }));
  }

  public render() {
    const { className, value, before, after } = this.props;
    const { maxHeight, containerWidth } = this.state;
    const ContainerStyle = {
      height: `${maxHeight}px`,
    };
    const beforeStyle = {
      width: `${value * containerWidth}px`,
    };
    const afterStyle = {
      width: `${containerWidth - value * containerWidth}px`,
    };
    const imgAfterStyle = {
      marginLeft: `-${value * containerWidth}px`,
    };

    return (
      <div className={className}>
        <div className={`${className}-ImageSwipe`}>
          <div className='SwipeContainer' style={ContainerStyle} ref={this.containerRef}>
            <div className='ImageContainer__before  border border-green' style={beforeStyle}>
              <img src={before} className='Image__before' onLoad={this.imgLoadHandler} />
            </div>
            <div className='ImageContainer__after  border border-red' style={afterStyle}>
              <img src={after} className='Image__after' onLoad={this.imgLoadHandler} style={imgAfterStyle} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
