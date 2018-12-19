import * as React from 'react';
import cn from 'classnames';
import { getColorByStatus, isSkippedStatus } from 'src/utils';

import Pagination from 'src/components/ui/Pagination';
import StatusIcon from 'src/components/modules/TestBox/Browser/Status/Icon';
import Text from 'src/components/ui/Text/Text';
import { BrowserNameStyled } from './styled';

import { StatusProps } from './types';

export default class Status extends React.PureComponent<StatusProps> {
  public render() {
    const {
      className,
      onClickAtTitle,
      pageCount,
      status,
      handleDataChange,
      pageCurrent,
      data: { name },
    } = this.props;

    const isSkippedTest = isSkippedStatus(status);
    const color = getColorByStatus(status);
    const cnStatus = cn(className, 'd-flex flex-justify-between flex-items-center');

    return (
      <Text
        as='span'
        className={cnStatus}
        textColor={color}
        textType='bold'
      >
        <StatusIcon mr={2} status={status} />
        <BrowserNameStyled
          as='span'
          textType='bold'
          textColor={color}
          mr={6}
          onClick={onClickAtTitle}
        >
          {name}
        </BrowserNameStyled>
        {
          pageCount >= 0 &&
          <>
            <Text as={'span'} textColor={'gray'} mr={2}>
              <i>Attempts:</i>{' '}
            </Text>
            <Pagination
              defaultCurrentPage={pageCurrent}
              hasPreventDefault={true}
              pageCount={pageCount}
              handleDataChange={handleDataChange}
              pageCurrent={pageCurrent}
            />
          </>
        }
        {
          isSkippedTest &&
          <Text as={'span'} textColor={'gray'} ml={3}>
            <i>Comment:</i>{' '}
            <Text as={'span'} textColor={'gray'}>skipComment</Text>
          </Text>
        }
      </Text>
    );
  }
}
