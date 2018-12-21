import * as React from 'react';

import { IScriptViewerProps } from './types';
import { ScriptBoxStyled } from './styled';

export default class ScriptViewer extends React.PureComponent<IScriptViewerProps> {
  public render() {
    const { scenario } = this.props;

    return (
      <>
        <div className='Box-row Box-row--gray Box--condensed pt-2 pb-2'>
          <ScriptBoxStyled>
            <p className='m-0'>
              <strong>Description: </strong>
            </p>
          </ScriptBoxStyled>
        </div>
        <div className='Box-row'>
          <pre className='pl-3'>
            {scenario || 'Scenario file not found'}
          </pre>
        </div>
      </>
    );
  }
}
