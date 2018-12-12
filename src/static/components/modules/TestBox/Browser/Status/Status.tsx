import * as React from 'react';
import cn from 'classnames';

import Pagination from 'src/components/ui/Pagination';
import StatusIcon from 'src/components/modules/TestBox/Browser/Status/Icon';
import Text from 'src/components/ui/Text/Text';
import { BrowserNameStyled } from './styled';

import { StatusProps } from './types';
import { ColorType } from 'src/components/ui/types';

export default class Status extends React.PureComponent<StatusProps> {
  public cnStatus = cn(
    this.props.className,
    'd-flex flex-justify-between flex-items-center',
  );

  public isFail = () => {
    return ['fail', 'error'].indexOf(this.props.status) !== -1;
  }

  public statusColor: ColorType = this.isFail() ? 'red' : 'green';
  public maxPage = this.props.data.attempt + 1;

  public render() {
    const {
      onClickAtTitle,
      pageCount,
      handleDataChange,
      pageCurrent,
      title,
    } = this.props;
    return (
      <Text
        as='span'
        className={this.cnStatus}
        textColor={this.statusColor}
        textType='bold'
      >
        <StatusIcon mr={2} isFail={this.isFail()} />
        <BrowserNameStyled
          as='span'
          textType='bold'
          textColor={this.statusColor}
          mr={6}
          onClick={onClickAtTitle}
        >
          {title}
        </BrowserNameStyled>
        <Text as={'span'} textColor={'gray'} mr={2}>
          <i>Attempts:</i>{' '}
        </Text>
        <Pagination
          defaultCurrentPage={pageCount}
          hasPreventDefault={true}
          pageCount={pageCount}
          handleDataChange={handleDataChange}
          pageCurrent={pageCurrent}
        />
      </Text>
    );
  }
}
