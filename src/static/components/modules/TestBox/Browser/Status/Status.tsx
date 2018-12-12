import * as React from 'react';
import cn from 'classnames';
import { isFailedTest } from 'src/utils';

import Pagination from 'src/components/ui/Pagination';
import StatusIcon from 'src/components/modules/TestBox/Browser/Status/Icon';
import Text from 'src/components/ui/Text/Text';
import { BrowserNameStyled } from './styled';

import { StatusProps } from './types';
import { ColorType } from 'src/components/ui/types';

export default class Status extends React.PureComponent<StatusProps> {
  public render() {
    const {
      className,
      onClickAtTitle,
      pageCount,
      status,
      handleDataChange,
      pageCurrent,
      title,
    } = this.props;

    const cnStatus = cn(
      className,
      'd-flex flex-justify-between flex-items-center',
    );
    const isFail = isFailedTest({ status });
    const statusColor: ColorType = isFail ? 'red' : 'green';

    return (
      <Text
        as='span'
        className={cnStatus}
        textColor={statusColor}
        textType='bold'
      >
        <StatusIcon mr={2} isFail={isFail} />
        <BrowserNameStyled
          as='span'
          textType='bold'
          textColor={statusColor}
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
