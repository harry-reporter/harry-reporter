import * as React from 'react';
import cn from 'classnames';

import { HeaderProps } from './types';

import Controls from '../Controls';
import Status from '../Status';

export default class Header extends React.PureComponent<HeaderProps> {
  private handleClickAtHeader = (e) => {
    if (e.target === e.currentTarget) {
      this.props.onToggle();
    }
  }

  private cnHeader = cn(
    this.props.className,
    'Box-row--gray d-flex flex-justify-between flex-items-center px-3 py-2',
  );

  public render() {
    const {
      isGui, data, handleDataChange, pageCurrent, pageCount, isOpenedBrowser,
      onToggle, onAccept, handleViewChange, viewType, url, status,
    } = this.props;

    return (
      <div className={this.cnHeader} onClick={this.handleClickAtHeader}>
        <Status
          data={data}
          status={status}
          onClickAtTitle={this.handleClickAtHeader}
          handleDataChange={handleDataChange}
          pageCurrent={pageCurrent}
          pageCount={pageCount}
        />
        <Controls
          isGui={isGui}
          data={data}
          isOpenedBrowser={isOpenedBrowser}
          onToggle={onToggle}
          onAccept={onAccept}
          handleViewChange={handleViewChange}
          viewType={viewType}
          url={url}
        />
      </div>
    );
  }
}
