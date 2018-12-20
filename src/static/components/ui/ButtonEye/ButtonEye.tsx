import * as React from 'react';

import Octicon, { Eye } from '@githubprimer/octicons-react';

interface IButtonEye {
  url: string;
  host?: string;
}

export default class ButtonEye extends React.PureComponent<IButtonEye> {
  private getUrl(url, host) {
    return host ? `${host}${url}` : url;
  }

  public render() {
    return (
      <div className='ButtonEye' aria-label='Eye'>
        <a href={this.getUrl(this.props.url, this.props.host)} target='_blank' className='ButtonEye-link text-gray'>
          <Octicon icon={Eye} verticalAlign='middle' />
        </a>
      </div>
    );
  }
}
