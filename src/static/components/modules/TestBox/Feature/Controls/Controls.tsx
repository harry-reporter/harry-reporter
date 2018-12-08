import * as React from 'react';

import Octicon, { ChevronDown, ChevronUp, Eye } from '@githubprimer/octicons-react';
import { ButtonIconContainerStyled, ControlsStyled } from '../../Header/styled';

import Button from 'src/components/ui/Button/Button';
import ButtonsGroup from 'src/components/ui/ButtonGroup/ButtonGroup';

import { ControlsProps } from 'src/components/modules/TestBox/Feature/Controls/types';
import ControlViewers from 'src/components/modules/TestBox/Feature/Controls/ControlViewers/ControlViewers';
import ButtonEye from 'src/components/ui/ButtonEye/ButtonEye';

export default class Controls extends React.PureComponent<ControlsProps> {
  public getChevron = (isOpenedFeature) => (isOpenedFeature ? ChevronUp : ChevronDown);

  public handleViewClick() {
    const path = './';
    window.open(path, '_blank');
  }
  // TODO: объявить объекты, которые передаются в качестве пропс
  public render() {
    const { isOpenedFeature, onToggle, viewType, handleViewChange, data } = this.props;
    return (
      <ControlsStyled>
        <ControlViewers selectedId={2} onChange={handleViewChange} viewType={viewType} />
        <ButtonsGroup className={'mr-3'} btns={[{ title: 'Skip', size: 'sm' }, { title: 'Accept', size: 'sm' }]} />
        <Button size={'sm'} className={'mr-3'} title={'View'} onClick={this.handleViewClick} />
        <ButtonIconContainerStyled className={'mr-3'} role={'button'}>
          <ButtonEye url={data.metaInfo.url} />
        </ButtonIconContainerStyled>
        <ButtonIconContainerStyled role={'button'} onClick={onToggle}>
          <Octicon icon={this.getChevron(isOpenedFeature)} />
        </ButtonIconContainerStyled>
      </ControlsStyled>
    );
  }
}
