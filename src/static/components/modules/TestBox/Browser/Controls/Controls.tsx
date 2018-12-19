import * as React from 'react';
import Octicon from '@githubprimer/octicons-react';

import { ButtonIconContainerStyled, ControlsStyled } from '../../Header/styled';
import { getChevron } from '../../common-utils';
import { ControlsProps } from 'src/components/modules/TestBox/Browser/Controls/types';

import Button from '../../../../ui/Button/Button';
import ButtonsGroup from '../../../../ui/ButtonGroup/ButtonGroup';
import ControlViewers from 'src/components/modules/TestBox/Browser/Controls/ControlViewers/ControlViewers';
import ButtonEye from 'src/components/ui/ButtonEye/ButtonEye';

export default class Controls extends React.PureComponent<ControlsProps> {
  constructor(props) {
    super(props);
    this.handleViewClick = this.handleViewClick.bind(this);
  }

  private handleViewClick() {
    const pathGit = this.props.gitUrl;
    const pathFile = this.props.data.metaInfo.file;
    if (pathGit) {
      const url = `${pathGit}/${pathFile}`;
      window.open(url, '_blank');
    }
  }

  private btns = [
    {
      title: 'Accept',
      size: 'sm',
      disabled: this.props.data.status !== 'fail',
      onClick: this.props.onAccept,
    },
  ];

  // TODO: объявить объекты, которые передаются в качестве пропс
  public render() {
    const {
      isGui,
      isOpenedBrowser,
      onToggle,
      viewType,
      handleViewChange,
      data,
      url,
      gitUrl,
    } = this.props;

    const disabled: boolean = !gitUrl || gitUrl === '';

    return (
      <ControlsStyled>
        <ControlViewers
          isOpenedBrowser={isOpenedBrowser}
          onChange={handleViewChange}
          viewType={viewType}
        />
        {isGui && <ButtonsGroup className={'mr-3'} btns={this.btns} />}
        <Button
          size={'sm'}
          className={'mr-3'}
          disabled={disabled}
          title={'View'}
          onClick={this.handleViewClick}
        />
        <ButtonIconContainerStyled className={'mr-3'} role={'button'}>
          <ButtonEye url={data.metaInfo.url} host={url} />
        </ButtonIconContainerStyled>
        <ButtonIconContainerStyled role={'button'} onClick={onToggle}>
          <Octicon icon={getChevron(isOpenedBrowser)} />
        </ButtonIconContainerStyled>
      </ControlsStyled>
    );
  }
}
