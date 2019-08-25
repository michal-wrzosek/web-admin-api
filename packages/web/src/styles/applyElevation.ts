import { style } from 'styled-system';
import { css } from 'styled-components';

export const applyElevationFunc = (elevation: string | number) => {
  const bottom = Number(elevation);
  const spread1 = 2 + Number(elevation);
  const spread2 = 1 + Number(elevation);
  const alpha1 = 0.12;
  const alpha2 = alpha1 * 2;
  return `0 ${bottom}px ${spread1}px rgba(0,0,0,${alpha1}), 0 ${bottom}px ${spread2}px rgba(0,0,0,${alpha2})`;
};

export const applyElevation = style({
  prop: 'elevation',
  cssProperty: 'box-shadow',
  transformValue: applyElevationFunc,
});

export const applyElevationCss = (elevation: number) => css`
  box-shadow: ${applyElevationFunc(elevation)};
`;
