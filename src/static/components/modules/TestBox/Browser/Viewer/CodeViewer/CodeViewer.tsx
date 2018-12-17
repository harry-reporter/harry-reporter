import * as React from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/languages/hljs/javascript';
import { github } from 'react-syntax-highlighter/dist/styles/hljs';

import { CodeViewerProps } from './types';

SyntaxHighlighter.registerLanguage('javascript', js);

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
          {this.renderItem('platform', platform)}
          <p className='m-0'>
            <strong>url: </strong> <a href={`${url}`}>{url}</a>
          </p>
          {this.renderItem('file', file)}
          {this.renderItem('sessionId', sessionId)}
        </div>
        <div className='Box-row'>
          <SyntaxHighlighter
            language='javascript'
            style={github}
          >
            {testBody}
          </SyntaxHighlighter>
        </div>
      </>
    );
  }
}
