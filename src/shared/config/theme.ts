import type { ThemeConfig } from 'antd'

const baseTheme: ThemeConfig = {
  token: {
    colorPrimary: '#264B82',
    colorSuccess: '#0D9B68',
    colorWarning: '#F67319',
    colorError: '#DB2B21',
    colorInfo: '#167C85',

    colorTextBase: '#1A1A1A',
    colorTextSecondary: '#8C8C8C',

    colorBgContainer: '#ffffff',
    colorBgLayout: '#E7EEF7',
    colorBorderSecondary: '#D4DBE6',
    colorBorder: '#D4DBE6',

    borderRadius: 8,

    fontFamily: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 16,
    fontSizeLG: 18,
    fontSizeSM: 14,
  },
  components: {
    Typography: {
      titleMarginBottom: 0,
    },
    Button: {
      colorPrimaryBorder: '#264B82',
      defaultBorderColor: '#D4DBE6',
    },
    Tag: {
      colorPrimary: '#264B82',
    },
  },
}

const headingsByBreakpoint = {
  desktop: {
    fontSizeHeading1: 40,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 20,
  },
  mobile: {
    fontSizeHeading1: 20,
    fontSizeHeading2: 24,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,
    fontSize: 14,
    fontSizeSM: 12,
  },
} as const

export function getPortalTheme(isMobile: boolean): ThemeConfig {
  const headings = isMobile ? headingsByBreakpoint.mobile : headingsByBreakpoint.desktop

  return {
    ...baseTheme,
    token: {
      ...baseTheme.token,
      ...headings,
    },
  }
}
