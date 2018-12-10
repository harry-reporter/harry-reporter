import * as React from 'react';

import { CodeViewerProps } from './types';

export default class CodeViewer extends React.PureComponent<CodeViewerProps> {
  public render() {
    const {
      metaInfo: {
        platform,
        url,
        file,
        sessionId,
      },
      testBody,
    } = this.props;

    return (
      <>
        <div className='Box-row Box-row--gray Box--condensed pt-2 pb-2'>
          <p className='mb-1'>
            <strong>Meta-info: </strong>
          </p>
          <p className='m-0'>
            <strong>platform: </strong>
            {platform}
          </p>
          <p className='m-0'>
            <strong>url: </strong> <a href={`${url}`}>{url}</a>
          </p>
          <p className='m-0'>
            <strong>file: </strong>
            {file}
          </p>
          <p className='m-0'>
            <strong>sessionId: </strong>
            {sessionId}
          </p>
        </div>
        <div className='Box-row'>
          <pre className='pl-3'>{testBody}</pre>
        </div>
      </>
    );
  }
}
