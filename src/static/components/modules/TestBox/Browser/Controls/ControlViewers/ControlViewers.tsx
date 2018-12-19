import * as React from 'react';

import ButtonsGroup from 'src/components/ui/ButtonGroup/ButtonGroup';
import { Code, File, ListUnordered } from '@githubprimer/octicons-react';
import { ButtonProps } from 'src/components/ui/Button/types';
import { ControlViewersProps, ControlViewersState } from './types';

export default class ControlViewers extends React.PureComponent<ControlViewersProps, ControlViewersState> {
  private handleClickAtButton = (viewType: string) => () => {
    this.props.onChange(viewType);
  }

  public render(): JSX.Element {
    const { viewType, isOpenedBrowser } = this.props;

    const buttonOptions: ButtonProps[] = [
      {
        title: '',
        size: 'sm',
        icon: Code,
        isSelected: isOpenedBrowser && viewType === 'code',
        onClick: this.handleClickAtButton('code'),
      },
      {
        title: '',
        size: 'sm',
        icon: ListUnordered,
        isSelected: isOpenedBrowser && viewType === 'tests',
        onClick: this.handleClickAtButton('tests'),
      },
      {
        title: '',
        size: 'sm',
        icon: File,
        isSelected: isOpenedBrowser && viewType === 'screenshot',
        onClick: this.handleClickAtButton('screenshot'),
      },
    ];

    return <ButtonsGroup className={'mr-3'} btns={buttonOptions} />;
  }
}
