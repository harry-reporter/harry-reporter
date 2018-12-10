import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as appActions from 'src/store/modules/app/actions';
import * as testsActions from 'src/store/modules/tests/actions';
import Dropdown from 'src/components/ui/Dropdown';
import DropdownItem from 'src/components/ui/DropdownItem';
import Button from 'src/components/ui/Button';
import TextInput from 'src/components/ui/TextInput';
import ControlPanelStyled from './styled';

import { ControlPanelProps } from './types';
import { RootStore } from 'src/store/types/store';

interface ControlPanelState {}

class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {
  public componentDidMount() {
    const { isGui, initGui } = this.props;

    if (isGui)  {
      initGui();
    }
  }

  private handleScreenViewMode = (value: string) => () => this.props.setTestsViewMode(value);
  private handleTestsViewMode = (value: string) => () => this.props.setScreenViewMode(value);

  private handleRunFail = () => this.props.runFailedTests();
  private handleAcceptAll = () => this.props.acceptAll();
  private handleInputUrl = (ev) => this.props.setUrl(ev.target.value);

  public render(): JSX.Element {
    const { runAllTests, isGui} = this.props;

    if (!isGui) {
      return null;
    }

    return (
      <ControlPanelStyled>
        <TextInput placeholder={'Url input'} className={'mr-2 one-fourth'} onChange={this.handleInputUrl} />
        <Dropdown className={'mr-2'} title={'Run tests'}>
          <DropdownItem title={'Run all tests'} onClick={runAllTests} />
          <DropdownItem title={'Restart failed tests'} onClick={this.handleRunFail} />
        </Dropdown>

        <Dropdown className={'mr-2'} title={'Show/hide'}>
          <DropdownItem title={'Collapse all'} onClick={this.handleTestsViewMode('collapseAll')} />
          <DropdownItem title={'Expand all'} onClick={this.handleTestsViewMode('expandAll')} />
          <DropdownItem title={'Expand errors'} onClick={this.handleTestsViewMode('expandErrors')} />
          <DropdownItem title={'Expand retries'} onClick={this.handleTestsViewMode('expandRetries')} />
        </Dropdown>

        <Dropdown className={'mr-2'} title={'View mode'}>
          <DropdownItem title={'3-up'} onClick={this.handleScreenViewMode('3-up')} />
          <DropdownItem title={'Only Diff'} onClick={this.handleScreenViewMode('onlyDiff')} />
          <DropdownItem title={'Loupe'} onClick={this.handleScreenViewMode('loupe')} />
          <DropdownItem title={'Swipe'} onClick={this.handleScreenViewMode('swipe')} />
          <DropdownItem title={'Onion Skin'} onClick={this.handleScreenViewMode('onionSkin')} />
        </Dropdown>

        <Button title={'Accept all'} className={'mr-2'} onClick={this.handleAcceptAll} />
      </ControlPanelStyled>
    );
  }
}

const mapStateToProps = ({ app, tests }: RootStore) => ({
  url: app.url,
  isGui: tests.gui,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  ...appActions,
  ...testsActions,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
