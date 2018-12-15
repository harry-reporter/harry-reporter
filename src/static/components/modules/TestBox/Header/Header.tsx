import * as React from 'react';

import Octicon, { Clippy } from '@githubprimer/octicons-react';
import { ClipboardStyled, ControlsStyled, ButtonIconContainerStyled } from './styled';

import { HeaderProps, HeaderState } from './types';
import { getChevron, getColor } from '../common-utils';

import Text from 'src/components/ui/Text/Text';
import Button from 'src/components/ui/Button/Button';

class Header extends React.PureComponent<HeaderProps, HeaderState> {
  private getTitle = () => this.props.title;

  public handleRunClick() {
    // todo: отправлять post-запрос
  }

  public render(): JSX.Element {
    const { title, isOpenedBox, status } = this.props;
    const textColor = getColor(status);
    const Chevron = getChevron(isOpenedBox);

    return (
      <div
        className={'Box-row d-flex flex-justify-between flex-items-center p-3'}
      >
        <Text as={'span'} textColor={textColor} textType={'bold'}>
          {title}
        </Text>
        <ControlsStyled>
          <Button
            size={'sm'}
            className={'mr-3'}
            title={'Run'}
            onClick={this.handleRunClick}
          />
          <ClipboardStyled component='div' option-text={this.getTitle}>
            <Octicon icon={Clippy} />
          </ClipboardStyled>
          <ButtonIconContainerStyled
            role={'button'}
            onClick={this.props.onToggle}
          >
            <Octicon icon={Chevron} />
          </ButtonIconContainerStyled>
        </ControlsStyled>
      </div>
    );
  }
}

export default Header;
