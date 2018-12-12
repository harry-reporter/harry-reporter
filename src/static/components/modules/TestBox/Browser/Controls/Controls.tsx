import * as React from 'react';

import Octicon, {
  ChevronDown,
  ChevronUp,
  Eye,
} from '@githubprimer/octicons-react';
import { ButtonIconContainerStyled, ControlsStyled } from '../../Header/styled';

import Button from '../../../../ui/Button/Button';
import ButtonsGroup from '../../../../ui/ButtonGroup/ButtonGroup';

import { ControlsProps } from 'src/components/modules/TestBox/Browser/Controls/types';
import ControlViewers from 'src/components/modules/TestBox/Browser/Controls/ControlViewers/ControlViewers';
import ButtonEye from 'src/components/ui/ButtonEye/ButtonEye';

export default class Controls extends React.PureComponent<ControlsProps> {
  public getChevron = (isOpenedBrowser) =>
    isOpenedBrowser ? ChevronUp : ChevronDown

  public handleViewClick() {
    const path = './';
    window.open(path, '_blank');
  }
  // TODO: объявить объекты, которые передаются в качестве пропс
  public render() {
    const {
      isOpenedBrowser,
      onToggle,
      viewType,
      handleViewChange,
      data,
      url,
    } = this.props;
    const btns = [
      { title: 'Skip', size: 'sm' },
      { title: 'Accept', size: 'sm' },
    ];

    return (
      <ControlsStyled>
        <ControlViewers
          selectedId={2}
          onChange={handleViewChange}
          viewType={viewType}
        />
        <ButtonsGroup className={'mr-3'} btns={btns} />
        <Button
          size={'sm'}
          className={'mr-3'}
          title={'View'}
          onClick={this.handleViewClick}
        />
        <ButtonIconContainerStyled className={'mr-3'} role={'button'}>
          <ButtonEye url={data.metaInfo.url} host={url} />
        </ButtonIconContainerStyled>
        <ButtonIconContainerStyled role={'button'} onClick={onToggle}>
          <Octicon icon={this.getChevron(isOpenedBrowser)} />
        </ButtonIconContainerStyled>
      </ControlsStyled>
    );
  }
}
