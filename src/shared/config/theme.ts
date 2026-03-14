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
    colorBgLayout: '#FFFFFF',
    colorBorderSecondary: '#D4DBE6',
    colorBorder: '#D4DBE6',

    borderRadius: 0,

    fontFamily: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 15,
    fontSizeLG: 17,
    fontSizeSM: 13,
  },
  components: {
    Typography: {
      titleMarginBottom: 24,
      fontWeightStrong: 700,
    },
    Button: {
      defaultBg: '#FFFFFF',
      defaultBorderColor: '#D4DBE6',
      defaultColor: '#264B82',
      defaultHoverBorderColor: '#264B82',
      defaultHoverColor: '#264B82',
      defaultHoverBg: '#FFFFFF',
      colorTextDisabled: '#D4DBE6',
      borderColorDisabled: '#D4DBE6',
      borderRadius: 0,
      colorPrimary: '#264B82',
      primaryColor: '#FFFFFF',
      colorPrimaryHover: '#264B82',
      colorPrimaryBg: '#FFFFFF',
      colorPrimaryBorder: '#D4DBE6',
    },
    Input: {
      borderRadius: 0,
      activeBorderColor: '#264B82',
      hoverBorderColor: '#264B82',
      colorTextPlaceholder: '#8C8C8C',
    },
    InputNumber: {
      borderRadius: 0,
      activeBorderColor: '#264B82',
      hoverBorderColor: '#264B82',
    },
    Pagination: {
      borderRadius: 100,
      itemActiveBg: '#264B82',
      colorPrimary: '#264B82',
      itemBg: 'transparent',
      itemSize: 40,
    },
    Select: {
      borderRadius: 0,
    },
    Menu: {
      horizontalItemSelectedColor: '#264B82',
      horizontalItemHoverColor: '#264B82',
      itemColor: '#8C8C8C',
      activeBarBorderWidth: 2,
      itemHoverColor: '#264B82',
      itemSelectedColor: '#264B82',
      horizontalItemBorderRadius: 0,
      colorItemBg: 'transparent',
      horizontalItemHoverBg: 'transparent',
      horizontalItemSelectedBg: 'transparent',
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
  const inputHeight = isMobile ? 36 : 48

  return {
    ...baseTheme,
    token: {
      ...baseTheme.token,
      ...headings,
    },
    components: {
      ...baseTheme.components,
      Button: {
        ...baseTheme.components?.Button,
        controlHeight: inputHeight,
      },
      Input: {
        ...baseTheme.components?.Input,
        controlHeight: inputHeight,
        ...(isMobile && { fontSize: 16 }),
      },
      InputNumber: {
        ...baseTheme.components?.InputNumber,
        controlHeight: inputHeight,
        ...(isMobile && { fontSize: 16 }),
      },
      Select: {
        ...baseTheme.components?.Select,
        controlHeight: inputHeight,
        ...(isMobile && { fontSize: 16 }),
      },
    },
  }
}
