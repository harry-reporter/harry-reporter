import * as React from 'react';

import Octicon, {
  ChevronDown,
  ChevronUp,
  Clippy,
  IssueOpened,
} from '@githubprimer/octicons-react';
import Text from 'src/components/ui/Text/Text';
import {
  ClipboardStyled,
  ControlsStyled,
  ButtonIconContainerStyled,
  HeaderContainerStyled,
} from './styled';

import { HeaderProps, HeaderState } from './types';
import { ColorType } from 'src/components/ui/types';
import Button from 'src/components/ui/Button/Button';

class Header extends React.PureComponent<HeaderProps, HeaderState> {
  private getTitle = () => this.props.title;

  private getTextColor = (): ColorType => {
    const { status } = this.props;
    return ['fail', 'error'].includes(status) ? 'red' : 'green';
  }

  private getChevron = (isOpenedBox) => (isOpenedBox ? ChevronUp : ChevronDown);

  public handleRunClick() {
    // todo: отправлять post-запрос
    console.log('run test-retries');
  }

  public render(): JSX.Element {
    const { title, isOpenedBox } = this.props;
    const textColor = this.getTextColor();
    const Chevron = this.getChevron(isOpenedBox);

    return (
      <HeaderContainerStyled
        className={
          'Box-header d-flex flex-justify-between flex-items-center p-3'
        }
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
      </HeaderContainerStyled>
    );
  }
}

export default Header;
