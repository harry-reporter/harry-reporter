import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as appActions from 'src/store/modules/app/actions';
import * as testsActions from 'src/store/modules/tests/actions';
import Dropdown from 'src/components/ui/Dropdown';
import Button from 'src/components/ui/Button';
import TextInput from 'src/components/ui/TextInput';
import ControlPanelStyled from './styled';
import { failedSuitesSelector } from 'src/store/modules/tests/selectors';

import { ControlPanelProps } from './types';
import { RootStore } from 'src/store/types/store';

const runTestItems = [
  { value: 'all', title: 'Run all tests' },
  { value: 'failed', title: 'Restart failed tests' },
];

const testsViewItems = [
  { value: 'collapseAll', title: 'Collapse all' },
  { value: 'expandAll', title: 'Expand all' },
  { value: 'expandErrors', title: 'Expand errors' },
  { value: 'expandRetries', title: 'Expand retries' },
];

const screenViewItems = [
  { value: '3-up', title: '3-up' },
  { value: 'onlyDiff', title: 'Only Diff' },
  { value: 'loupe', title: 'Loupe' },
  { value: 'swipe', title: 'Swipe' },
  { value: 'onionSkin', title: 'Onion Skin' },
];

class ControlPanel extends React.Component<ControlPanelProps> {
  public componentDidMount() {
    const { isGui, initGui } = this.props;

    if (isGui) {
      initGui();
    }
  }

  private handleInputUrl = (ev) => this.props.setUrl(ev.target.value);

  private handleAcceptAllClick = () => {
    const { failed, acceptAll } = this.props;
    acceptAll(failed);
  }

  private handleRunTestsClick = (value: string) => {
    const { runAllTests, runFailedTests, failed } = this.props;
    if (value === 'all') {
      runAllTests();
    } else {
      runFailedTests(failed);
    }
  }

  private handleScreenViewMode = (value: string) =>
    this.props.setScreenViewMode(value)
  private handleTestsViewMode = (value: string) =>
    this.props.setTestsViewMode(value)

  public render(): JSX.Element {
    return (
      <ControlPanelStyled>
        <TextInput
          placeholder={'Url input'}
          className={'mr-2 one-fourth'}
          onChange={this.handleInputUrl}
        />
        <Dropdown
          className={'mr-2'}
          title={'Run tests'}
          items={runTestItems}
          onChange={this.handleRunTestsClick}
        />
        <Dropdown
          className={'mr-2'}
          title={'Show/hide'}
          items={testsViewItems}
          onChange={this.handleTestsViewMode}
        />
        <Dropdown
          className={'mr-2'}
          title={'View mode'}
          items={screenViewItems}
          onChange={this.handleScreenViewMode}
        />
        <Button
          title={'Accept all'}
          className={'mr-2'}
          onClick={this.handleAcceptAllClick}
        />
      </ControlPanelStyled>
    );
  }
}

const mapStateToProps = ({ app, tests }: RootStore) => ({
  url: app.url,
  isGui: tests.gui,
  failed: failedSuitesSelector(tests),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      ...appActions,
      ...testsActions,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ControlPanel);
