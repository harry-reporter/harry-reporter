import * as React from 'react';

import Octicon, { Clippy, Sync } from '@githubprimer/octicons-react';
import { ClipboardStyled, ControlsStyled, ButtonIconContainerStyled } from './styled';

import { HeaderProps, HeaderState } from './types';
import { getChevron } from '../common-utils';

import Text from 'src/components/ui/Text/Text';
import Button from 'src/components/ui/Button/Button';
import { getColorByStatus } from 'src/utils';

class Header extends React.PureComponent<HeaderProps, HeaderState> {
  private getTitle = () => this.props.title;

  public render(): JSX.Element {
    const { title, isOpenedBox, status, retryHandler, isRunning, onToggle } = this.props;
    const textColor = getColorByStatus(status);
    const Chevron = getChevron(isOpenedBox);

    return (
      <div
        className={'Box-row d-flex flex-justify-between flex-items-center p-3'}
      >
        <Text
          as={'span'}
          textColor={textColor}
          textType={'bold'}
          onClick={onToggle}
        >
          {title}
        </Text>
        <ControlsStyled>
          { status === 'running' && (
            <div className={'d-inline-flex flex-items-center mr-3 anim-pulse'}>
              <Octicon icon={Sync} />
            </div>
          ) }
          <Button
            size={'sm'}
            className={'mr-3'}
            title={'Run'}
            onClick={retryHandler}
            disabled={isRunning}
          />
          <ClipboardStyled component='div' option-text={this.getTitle}>
            <Octicon icon={Clippy} />
          </ClipboardStyled>
          <ButtonIconContainerStyled
            role={'button'}
            onClick={onToggle}
          >
            <Octicon icon={Chevron} />
          </ButtonIconContainerStyled>
        </ControlsStyled>
      </div>
    );
  }
}

export default Header;
