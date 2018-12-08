import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as appActions from 'src/store/modules/app/actions';
import Dropdown from 'src/components/ui/Dropdown';
import DropdownItem from 'src/components/ui/DropdownItem';
import Button from 'src/components/ui/Button';
import TextInput from 'src/components/ui/TextInput';
import ControlPanelStyled from './styled';

import { ControlPanelProps } from './types';
import { RootStore } from 'src/store/types/store';

const ControlPanel: React.SFC<ControlPanelProps> = (props) => {
  const { setUrl, runAllTests, runFailedTests, acceptAll, setTestsViewMode, setScreenViewMode } = props;

  const handleInputUrl = (ev) => setUrl(ev.target.value);
  const handleRunFail = () => {
    // get fail tests and pass
    runFailedTests();
  };
  const handleAcceptAll = () => {
    // get fail tests and pass
    acceptAll();
  };

  const handleScreenViewMode = (value: string) => () => setTestsViewMode(value);
  const handleTestsViewMode = (value: string) => () => setScreenViewMode(value);

  return (
    <ControlPanelStyled>
      <TextInput placeholder={'Url input'} className={'mr-2 one-fourth'} onChange={handleInputUrl} />
      <Dropdown className={'mr-2'} title={'Run tests'}>
        <DropdownItem title={'Run all tests'} onClick={runAllTests} />
        <DropdownItem title={'Restart failed tests'} onClick={handleRunFail} />
      </Dropdown>

      <Dropdown className={'mr-2'} title={'Show/hide'}>
        <DropdownItem title={'Collapse all'} onClick={handleTestsViewMode('collapseAll')} />
        <DropdownItem title={'Expand all'} onClick={handleTestsViewMode('expandAll')} />
        <DropdownItem title={'Expand errors'} onClick={handleTestsViewMode('expandErrors')} />
        <DropdownItem title={'Expand retries'} onClick={handleTestsViewMode('expandRetries')} />
      </Dropdown>

      <Dropdown className={'mr-2'} title={'View mode'}>
        <DropdownItem title={'3-up'} onClick={handleScreenViewMode('3-up')} />
        <DropdownItem title={'Only Diff'} onClick={handleScreenViewMode('onlyDiff')} />
        <DropdownItem title={'Loupe'} onClick={handleScreenViewMode('loupe')} />
        <DropdownItem title={'Swipe'} onClick={handleScreenViewMode('swipe')} />
        <DropdownItem title={'Onion Skin'} onClick={handleScreenViewMode('onionSkin')} />
      </Dropdown>

      <Button title={'Accept all'} className={'mr-2'} onClick={handleAcceptAll} />
    </ControlPanelStyled>
  );
};

const mapStateToProps = ({ app }: RootStore) => ({
  url: app.url,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(appActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
