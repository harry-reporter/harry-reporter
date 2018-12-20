import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from 'src/store/modules/app/actions';

import Status from './Status';
import { NavigationStyled } from './styled';

import { NavigationPanelProps } from './types';
import { RootStore } from 'src/store/types/store';

const NavigationPanel: React.SFC<NavigationPanelProps> = (props) => {
  const { total, passed, failed, skipped, retries } = props;
  const navigationList = [
    {
      name: 'total',
      component: <Status mr={3} name={'Total Tests'} value={total} />,
    },
    {
      name: 'passed',
      component: <Status mr={3} name={'Passed'} value={passed} color={'green'} />,
    },
    {
      name: 'failed',
      component: <Status mr={3} name={'Failed'} value={failed} color={'red'} />,
    },
    {
      name: 'skipped',
      component: <Status mr={3} name={'Skipped'} value={skipped} color={'gray'} />,
    },
    {
      name: 'retries',
      component: <Status mr={3} name={'Retries'} value={retries} color={'yellow'} />,
    },
  ];

  const handleChange = (type) => {
    props.setTestsType(type);
  };

  return (
    <section>
      <NavigationStyled onChange={handleChange} dataList={navigationList} />
    </section>
  );
};

const mapStateToProps = ({ tests }: RootStore) => ({
  total: tests.stats.total,
  passed: tests.stats.passed,
  failed: tests.stats.failed,
  skipped: tests.stats.skipped,
  retries: tests.stats.retries,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(appActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationPanel);
