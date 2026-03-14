import type { ThemeConfig } from 'antd'

export type ButtonToken = NonNullable<NonNullable<ThemeConfig['components']>['Button']>

export const accentButtonTokens: ButtonToken = {
  defaultBg: '#DB2B21',
  defaultBorderColor: 'transparent',
  defaultColor: '#FFFFFF',
  defaultHoverBg: '#b52219',
  defaultHoverBorderColor: 'transparent',
  defaultHoverColor: '#FFFFFF',
  colorTextDisabled: 'rgba(255,255,255,0.5)',
  colorBgContainerDisabled: '#e8736b',
  borderColorDisabled: 'transparent',
}

export const secondaryButtonTokens: ButtonToken = {
  defaultBg: '#FFFFFF',
  defaultBorderColor: '#264B82',
  defaultColor: '#264B82',
  defaultHoverBg: '#D4DBE6',
  defaultHoverBorderColor: '#264B82',
  defaultHoverColor: '#264B82',
}
