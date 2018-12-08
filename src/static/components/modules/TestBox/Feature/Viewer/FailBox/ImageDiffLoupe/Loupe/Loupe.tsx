import * as React from 'react';

import './Loupe.css';
import './types';

export default class Loupe extends React.PureComponent<ILoupeProps, {}> {
  public BORDERWIDTH = 3;
  private loupeRef;
  constructor(props) {
    super(props);
    this.loupeRef = React.createRef();
  }
  public componentDidMount() {
    const { onMove } = this.props;
    this.loupeRef.current.addEventListener('mousemove', onMove);
    this.loupeRef.current.addEventListener('touchmove', onMove);
  }
  public render() {
    const { src, width, zoom, height, left, top, x, y } = this.props;
    const w = !this.loupeRef.current ? 0 : this.loupeRef.current.offsetWidth / 2;
    const h = !this.loupeRef.current ? 0 : this.loupeRef.current.offsetHeight / 2;

    const posX = x * zoom - w + this.BORDERWIDTH;
    const posY = y * zoom - h + this.BORDERWIDTH;

    const style = {
      backgroundImage: `url(${src})`,
      backgroundSize: `${width * zoom}px ${height * zoom}px`,
      left,
      top,
      backgroundPosition: `-${posX}px -${posY}px`,
    };

    return <div className='Loupe' style={style} ref={this.loupeRef} />;
  }
}
