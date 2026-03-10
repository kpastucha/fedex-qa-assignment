export const TAG = {
  A11Y: '@a11y',
  API: '@API',
  FUNCTIONAL: '@functional',
  REGRESSION: '@regression',
  VISUAL: '@visual'
} as const;

export type Tag = (typeof TAG)[keyof typeof TAG];
