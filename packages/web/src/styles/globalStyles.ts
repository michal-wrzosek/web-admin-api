import { createGlobalStyle } from './styledComponents';
import { normalizeStyles } from './normalizeStyles';

export const GlobalStyles = createGlobalStyle`
  @import url(${({ theme }) => `'${theme.global.fontUrl}'`});

  ${normalizeStyles};

  html {
    font-size: 62.5%;
    box-sizing: border-box;
  }
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: ${({ theme }) => theme.global.fontFamily};
    color: ${({ theme }) => theme.global.color};
    background-color: ${({ theme }) => theme.global.bgColor};
    font-size: ${({ theme }) => theme.global.fontSize}rem;
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
`;
