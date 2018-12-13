import * as React from 'react';
import cn from 'classnames';

import { isFailedTest } from 'src/utils';
import { StatusProps } from './types';
import { getColor } from '../../common-utils';
import { BrowserNameStyled } from './styled';

import Pagination from 'src/components/ui/Pagination';
import StatusIcon from 'src/components/modules/TestBox/Browser/Status/Icon';
import Text from 'src/components/ui/Text/Text';

export default class Status extends React.PureComponent<StatusProps> {
  public render() {
    const {
      className,
      onClickAtTitle,
      pageCount,
      data: { status },
      handleDataChange,
      pageCurrent,
      data: { name },
    } = this.props;

    const cnStatus = cn(
      className,
      'd-flex flex-justify-between flex-items-center',
    );
    const isFail = isFailedTest({ status });
    const color = getColor(status);

    return (
      <Text
        as='span'
        className={cnStatus}
        textColor={color}
        textType='bold'
      >
        <StatusIcon mr={2} isFail={isFail} />
        <BrowserNameStyled
          as='span'
          textType='bold'
          textColor={color}
          mr={6}
          onClick={onClickAtTitle}
        >
          {name}
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
