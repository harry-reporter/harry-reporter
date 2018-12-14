import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import './types';
import './FailBox.css';
import { screenSelector } from './selector';
import { setScreenModForView } from 'src/store/modules/app/actions';
import { RootStore } from 'src/store/types/store';
import { ImageInfo } from 'src/store/modules/tests/types';

import ImageDiffSwipe from './ImageDiffSwipe/ImageDiffSwipe';
import ImageDiffLoupe from './ImageDiffLoupe/ImageDiffLoupe';
import ImageDiffOnionSkin from './ImageDiffOnionSkin/ImageDiffOnionSkin';
import { withMeasurer } from 'src/components/modules/TestBox/withMeasurer';

class FailBox extends React.Component<ImageInfo, FailBoxState> {
  public state = {
    valueSwipe: 0.5,
    valueOnionSkin: 0.5,
    valueLoupe: 2,
  };

  public componentDidUpdate(prevProps): void {
    if (this.props.screenViewMode !== prevProps.screenViewMode) {
      this.props.measure();
    }
  }

  private textModKeyItems = {
    '3-up': '3-up',
    onlyDiff: 'Only Diff',
    loupe: 'Loupe',
    swipe: 'Swipe',
    onionSkin: 'Onion Skin',
  };

  private handleInputChange = (e) => {
    return this.setState({ valueSwipe: parseFloat(e.target.value) });
  }

  private handleInputChangeOnion = (e) => {
    return this.setState({ valueOnionSkin: parseFloat(e.target.value) });
  }

  private handleInputChangeLoupe = (e) => {
    this.setState({ valueLoupe: parseFloat(e.target.value) });
  }

  private createHandleClickAtTab(key: string) {
    return () => {
      this.props.setScreenModForView(key, this.props.viewId);
    };
  }

  public getBoxContent(): JSX.Element {
    const { expectedPath, actualPath, diffPath } = this.props;

    return (
      <>
        {this.renderBoxItem('Expected', 'green', expectedPath)}
        {this.renderBoxItem('Actual', 'red', actualPath)}
        {this.renderBoxItem('Diff', 'gray', diffPath)}
      </>
    );
  }

  public getBoxContentDiff(): JSX.Element {
    const { diffPath } = this.props;

    return <>{this.renderBoxItem('Diff', 'gray', diffPath)}</>;
  }

  public renderBoxItem(cn: string, color: string, imgPath: string): JSX.Element {
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

  public renderBoxContentLoupe(): JSX.Element {
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
  public renderBoxContentSwipe(): JSX.Element {
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

  public renderBoxContentOnionSkin(): JSX.Element {
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
    switch (this.props.screenViewMode) {
      case 'onlyDiff':
        return this.getBoxContentDiff();
      case 'loupe':
        return this.renderBoxContentLoupe();
      case 'swipe':
        return this.renderBoxContentSwipe();
      case 'onionSkin':
        return this.renderBoxContentOnionSkin();
      case '3-up':
      default:
        return this.getBoxContent();
    }
  }

  public getTabModItem(): JSX.Element[] {
    return Object.keys(this.textModKeyItems).map((key) => {
      return this.renderTabItem(this.textModKeyItems[key], key);
    });
  }

  public renderTabItem(item: string, key: string): JSX.Element {
    const { screenViewMode } = this.props;
    const cnLink = classNames('modNav-item-link', {
      'selected': screenViewMode === key,
    });
    return (
      <li key={key} className='modNav-item'>
        <span
          className={cnLink}
          onClick={this.createHandleClickAtTab(key)}
        >
          {item}
        </span>
      </li>
    );
  }

  public render(): JSX.Element {
    return (
      <>
        <div className={`Box-row Box-row--darkgray d-flex flex-justify-center`}>
          {this.getView()}
        </div>
        <div className={`Box-footer Box-row--gray p-0`}>
          <nav className='modNav m-0 pt-1 pb-1' aria-label='Foo bar'>
            <ul className='modNav-body'>{this.getTabModItem()}</ul>
          </nav>
        </div>
      </>
    );
  }
}

function mapStateToProps(store: RootStore, ownProps: ImageInfo) {
  return screenSelector(store, ownProps);
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ setScreenModForView }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMeasurer<ImageInfo>(FailBox));
