import * as React from 'react';

import ImageDiffSwipe from './ImageDiffSwipe/ImageDiffSwipe';
import ImageDiffLoupe from './ImageDiffLoupe/ImageDiffLoupe';
import ImageDiffOnionSkin from './ImageDiffOnionSkin/ImageDiffOnionSkin';

import './types';
import './FailBox.css';
import { ImagesInfo } from '../types';
import { connect } from 'react-redux';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';

import { bindActionCreators } from 'redux';
import { setScreenModForView } from 'src/store/modules/app/actions';
import { RootStore } from 'src/store/types/store';

class FailBox extends React.PureComponent<ImagesInfo, FailBoxState> {
  public state = {
    valueSwipe: 0.5,
    valueOnionSkin: 0.5,
    valueLoupe: 2,
  };

  public componentDidUpdate(prevProps): void {
    if (prevProps) {
      if (this.props.screenViewMode !== prevProps.screenViewMode) {
        this.props.measure();
      }
    }
  }

  public textModKeyItems = {
    '3-up': '3-up',
    onlyDiff: 'Only Diff',
    loupe: 'Loupe',
    swipe: 'Swipe',
    onionSkin: 'Onion Skin',
  };

  public handleInputChange = (e) => {
    return this.setState({ valueSwipe: parseFloat(e.target.value) });
  }

  public handleInputChangeOnion = (e) => {
    return this.setState({ valueOnionSkin: parseFloat(e.target.value) });
  }

  public getBoxContent(): JSX.Element {
    const { expectedPath, actualPath, diffPath } = this.props;

    return (
      <>
        {this.getBoxItem('Expected', 'green', expectedPath)}
        {this.getBoxItem('Actual', 'red', actualPath)}
        {this.getBoxItem('Diff', 'gray', diffPath)}
      </>
    );
  }

  public getBoxContentDiff(): JSX.Element {
    const { diffPath } = this.props;

    return <>{this.getBoxItem('Diff', 'gray', diffPath)}</>;
  }

  public getBoxContentSwipe(): JSX.Element {
    const { valueSwipe } = this.state;
    const { expectedPath, actualPath } = this.props;

    return (
      <div className='BoxContentSwipe d-flex flex-column'>
        <ImageDiffSwipe
          before={expectedPath}
          after={actualPath}
          value={valueSwipe}
          className='BoxContentSwipe-ImageDiff'
        />
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={valueSwipe}
          onChange={this.handleInputChange}
          className='BoxContentSwipe-Range mt-2'
        />
      </div>
    );
  }

  public getBoxItem(cn: string, color: string, imgPath: string): JSX.Element {
    return (
      <div className={cn}>
        <p className={`Title text-${color} text-bold`}>{cn}</p>
        <img
          src={imgPath}
          alt={`${cn}-Img`}
          className={`FailBox-Img border border-${color}`}
        />
      </div>
    );
  }

  public getItem(item: string, key: string): JSX.Element {
    const { screenViewMode } = this.props;
    const isSelected = screenViewMode === key ? 'selected' : '';
    return (
      <li key={key} className='modNav-item'>
        <span
          className={`modNav-item-link ${isSelected}`}
          onClick={this.createHandleClickAtTab(key)}
        >
          {item}
        </span>
      </li>
    );
  }

  public getViewModItem(): JSX.Element[] {
    return Object.keys(this.textModKeyItems).map((key) => {
      return this.getItem(this.textModKeyItems[key], key);
    });
  }
  public createHandleClickAtTab(key: string) {
    return () => {
      this.props.setScreenModForView(key, this.props.viewId);
    };
  }

  public getViewMod() {
    return (
      <>
        <nav className='modNav m-0 pt-1 pb-1' aria-label='Foo bar'>
          <ul className='modNav-body'>{this.getViewModItem()}</ul>
        </nav>
      </>
    );
  }

  public getBoxContentLoupe(): JSX.Element {
    const { expectedPath, actualPath } = this.props;
    const { valueLoupe } = this.state;

    return (
      <div className='BoxContentLoupe d-flex flex-column'>
        <ImageDiffLoupe
          before={expectedPath}
          after={actualPath}
          zoom={valueLoupe}
          className='BoxContentLoupe-ImageDiff'
        />
        <input
          type='range'
          min={1}
          max={3}
          step={0.01}
          value={valueLoupe}
          onChange={this.handleInputChangeLoupe}
          className='BoxContentLoupe-range mt-2'
        />
      </div>
    );
  }

  public handleInputChangeLoupe = (e) => {
    this.setState({ valueLoupe: parseFloat(e.target.value) });
  }

  public getBoxContentOnionSkin(): JSX.Element {
    const { expectedPath, actualPath } = this.props;
    const { valueOnionSkin } = this.state;

    return (
      <div className='BoxContentOnionSkin d-flex flex-column'>
        <ImageDiffOnionSkin
          before={expectedPath}
          after={actualPath}
          value={valueOnionSkin}
          className='BoxContentOnionSkin-ImageDiff'
        />
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={valueOnionSkin}
          onChange={this.handleInputChangeOnion}
          className='BoxContentOnionSkin-range mt-2'
        />
      </div>
    );
  }

  public getView() {
    let view = null;
    const { screenViewMode } = this.props;

    switch (screenViewMode) {
      case 'onlyDiff':
        view = this.getBoxContentDiff();
        break;
      case 'loupe':
        view = this.getBoxContentLoupe();
        break;
      case 'swipe':
        view = this.getBoxContentSwipe();
        break;
      case 'onionSkin':
        view = this.getBoxContentOnionSkin();
        break;
      case '3-up':
      default:
        view = this.getBoxContent();
    }
    return view;
  }

  public render(): JSX.Element {
    return (
      <>
        <div className={`Box-row Box-row--darkgray d-flex flex-justify-center`}>
          {this.getView()}
        </div>
        <div className={`Box-footer Box-row--gray p-0`}>
          {this.getViewMod()}
        </div>
      </>
    );
  }
}

function mapStateToProps({ app }: RootStore, ownProps: ImagesInfo) {
  let screenViewMode = app.screenPerView[ownProps.viewId];
  if (screenViewMode === undefined) {
    screenViewMode = app.screenViewMode;
  }
  return {
    screenViewMode,
  };
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ setScreenModForView }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMeasurer<ImagesInfo>(FailBox));
