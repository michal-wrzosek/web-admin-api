export enum BREAKPOINT_KEYS {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export const breakpointKeys = [BREAKPOINT_KEYS.sm, BREAKPOINT_KEYS.md, BREAKPOINT_KEYS.lg, BREAKPOINT_KEYS.xl];

export const breakpoints: { [key in BREAKPOINT_KEYS]: number } = {
  [BREAKPOINT_KEYS.sm]: 600,
  [BREAKPOINT_KEYS.md]: 900,
  [BREAKPOINT_KEYS.lg]: 1200,
  [BREAKPOINT_KEYS.xl]: 1800,
};

export const breakpointValues = [breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl];
