import * as React from 'react';
import cn from 'classnames';

import Button from '../Button';

import { IButtonsGroupProps } from './types';

class ButtonsGroup extends React.Component<IButtonsGroupProps> {
  public renderBtns = (): React.ReactNode => {
    const { btns } = this.props;

    return btns.map((btn, id) => (
      <Button className={'BtnGroup-item'} key={id} {...btn}>{btn.title}</Button>
    ));
  }

  public render() {
    const { className } = this.props;

    const cnButton = cn('BtnGroup', className);

    return (
      <div className={cnButton}>
        {this.renderBtns()}
      </div>
    );
  }
}
export default ButtonsGroup;
