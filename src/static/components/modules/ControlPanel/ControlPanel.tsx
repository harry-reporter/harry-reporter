import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as appActions from 'src/store/modules/app/actions';
import Dropdown from 'src/components/ui/Dropdown';
import Button from 'src/components/ui/Button';
import TextInput from 'src/components/ui/TextInput';
import ControlPanelStyled from './styled';

import { ControlPanelProps } from './types';
import { RootStore } from 'src/store/types/store';

const ControlPanel: React.SFC<ControlPanelProps> = (props) => {
  const { setUrl, runAllTests, runFailedTests, acceptAll, setTestsViewMode, setScreenViewMode } = props;

  const handleInputUrl = (ev) => setUrl(ev.target.value);

  const handleAcceptAll = () => {
    // get fail tests and pass
    acceptAll();
  };

  const handleRunTestsClick = (value: string) => {
    if (value === 'all') {
      runAllTests();
    } else {
      // get fail tests and pass
      runFailedTests();
    }
  };

  const handleScreenViewMode = (value: string) => setScreenViewMode(value);
  const handleTestsViewMode = (value: string) => setTestsViewMode(value);

  const runTestItems = [
    { title: 'Run all tests', value: 'all' },
    { title: 'Restart failed tests', value: 'failed' },
  ];

  const testsViewItems = [
    { title: 'Collapse all', value: 'collapseAll' },
    { title: 'Expand all', value: 'expandAll' },
    { title: 'Expand errors', value: 'expandErrors' },
    { title: 'Expand retries', value: 'expandRetries' },
  ];

  const screenViewItems = [
    { title: '3-up', value: '3-up' },
    { title: 'Only Diff', value: 'onlyDiff' },
    { title: 'Loupe', value: 'loupe' },
    { title: 'Swipe', value: 'swipe' },
    { title: 'Onion Skin', value: 'onionSkin' },
  ];

  return (
    <ControlPanelStyled>
      <TextInput placeholder={'Url input'} className={'mr-2 one-fourth'} onChange={handleInputUrl} />
      <Dropdown className={'mr-2'} title={'Run tests'} items={runTestItems} onChange={handleRunTestsClick} />
      <Dropdown className={'mr-2'} title={'Show/hide'} items={testsViewItems} onChange={handleTestsViewMode} />
      <Dropdown className={'mr-2'} title={'View mode'} items={screenViewItems} onChange={handleScreenViewMode} />
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
