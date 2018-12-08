import * as React from 'react';

import Clipboard from 'react-clipboard.js';
import Octicon, { Clippy } from '@githubprimer/octicons-react';

interface IButtonCopy {
  textToCopy: string;
}

class ButtonCopy extends React.Component<IButtonCopy> {
  constructor(props) {
    super(props);
  }

  public getText = (): string => {
    return this.props.textToCopy;
  }

  public render() {
    return (
      <div className='text-gray' aria-label='Copy' data-copied-hint='Copied!'>
        <Clipboard component='div' option-text={this.getText}>
          <Octicon icon={Clippy} />
        </Clipboard>
      </div>
    );
  }
}

export default ButtonCopy;
