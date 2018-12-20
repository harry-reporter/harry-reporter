import * as React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, theme } from '../theme';
import { store } from '../store';

import GlobalStyle from './GlobalStyle';
import Header from './layouts/Header/Header';
import Main from 'src/components/layouts/Main';
import NavigationPanel from 'src/components/modules/NavigationPanel/NavigationPanel';
import ControlPanel from 'src/components/modules/ControlPanel';
import Title from 'src/components/ui/Title/Title';
import TestsContainer from 'src/components/modules/TestsContainer/TestsContainer';

interface AppProps {}

const App: React.SFC<AppProps> = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <>
          <Header pt={5} pl={3} pr={3}>
            <Title as={'h1'}>Harry reporter</Title>
          </Header>
          <Main pl={3} pr={3}>
            <NavigationPanel />
            <ControlPanel />
            <TestsContainer />
          </Main>
          <GlobalStyle />
        </>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
