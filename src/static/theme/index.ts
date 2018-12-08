import * as styledComponents from 'styled-components';
import { switchProp, ifProp } from 'styled-tools';
import * as theme from './vars';
import * as GlobalStyle from '../components/GlobalStyle';

const {
  default: styled,
  css,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<IThemeInterface>;

export type IThemeInterface = typeof theme;

export { css, GlobalStyle, keyframes, ThemeProvider, theme, switchProp, ifProp };
export default styled;
