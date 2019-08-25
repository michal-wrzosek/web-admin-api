import { breakpointValues } from './breakpoints';

// rem
export const spaces = [
  0, //// 0
  0.4, // 1
  0.8, // 2
  1.6, // 3
  2.4, // 4
  4.8, // 5
];

// rem
export const fontSizes = [
  1, //// 0
  1.2, // 1
  1.8, // 2
  2.4, // 3
  4.8, // 4
];

export const colors = {
  black1: '#000000',
  white1: '#FFFFFF',
};

export const fontWeights = {
  normal: 400,
  bold: 700,
};

const global = {
  fontUrl: 'https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap',
  fontFamily: "'Roboto', sans-serif",
  color: colors.black1,
  bgColor: colors.white1,
  fontSize: fontSizes[1],
};

const grid = {
  gutter: spaces[2],
  borderRadius: 0.8,
  padding: 1.2,
};

const theme = {
  spaces,
  fontSizes,
  fontWeights,
  colors,
  breakpoints: breakpointValues,
  global,
  grid,
};

export default theme;
