import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';

import theme from './theme';

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
  ServerStyleSheet,
} = styledComponents as ThemedStyledComponentsModule<typeof theme>;

export { css, createGlobalStyle, keyframes, ThemeProvider, ServerStyleSheet };
export default styled;
