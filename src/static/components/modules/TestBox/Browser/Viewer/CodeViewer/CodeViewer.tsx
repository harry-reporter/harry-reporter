import * as React from 'react';

import { CodeViewerProps } from './types';

export default class CodeViewer extends React.PureComponent<CodeViewerProps> {

  private renderItem(title: string, value): JSX.Element {
    return (
      <p className='m-0'>
        <strong>{title}: </strong>
        {value}
      </p>
    );
  }
  public render() {
    const { metaInfo: { platform, url, file, sessionId }, testBody } = this.props;

    return (
      <>
        <div className='Box-row Box-row--gray Box--condensed pt-2 pb-2'>
          <p className='mb-1'>
            <strong>Meta-info: </strong>
          </p>
          {this.renderItem('platform', platform)}
          <p className='m-0'>
            <strong>url: </strong> <a href={`${url}`}>{url}</a>
          </p>
          {this.renderItem('file', file)}
          {this.renderItem('sessionId', sessionId)}
        </div>
        <div className='Box-row'>
          <pre className='pl-3'>{testBody}</pre>
        </div>
      </>
    );
  }
}
