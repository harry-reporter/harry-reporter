import * as React from 'react';
import cn from 'classnames';

import Controls from '../Controls';
import Status from '../Status';

import { HeaderProps } from './types';

export default class Header extends React.PureComponent<HeaderProps> {
  public handleClickAtHeader = (e) => {
    if (e.target === e.currentTarget) {
      this.props.onToggle();
    }
  }

  public cnHeader = cn(
    this.props.className,
    'Box-row--gray d-flex flex-justify-between flex-items-center px-3 py-2',
  );

  public render() {
    const {
      data,
      title,
      status,
      handleDataChange,
      pageCurrent,
      pageCount,
      isOpenedFeature,
      onToggle,
      handleViewChange,
      viewType,
      url,
    } = this.props;

    return (
      <div className={this.cnHeader} onClick={this.handleClickAtHeader}>
        <Status
          data={data}
          title={title}
          status={status}
          onClickAtTitle={this.handleClickAtHeader}
          handleDataChange={handleDataChange}
          pageCurrent={pageCurrent}
          pageCount={pageCount}
        />
        <Controls
          data={data}
          isOpenedFeature={isOpenedFeature}
          onToggle={onToggle}
          handleViewChange={handleViewChange}
          viewType={viewType}
          url={url}
        />
      </div>
    );
  }
}
