import { Button as AntButton, ConfigProvider } from 'antd'

import { accentButtonTokens, secondaryButtonTokens, type ButtonToken } from './themes'
import type { CustomButtonProps } from './types'

type ButtonVariant = 'default' | 'accent' | 'secondary'

const variantTokens: Partial<Record<ButtonVariant, ButtonToken>> = {
  accent: accentButtonTokens,
  secondary: secondaryButtonTokens,
}

export const Button = ({ variant = 'default', children, ...props }: CustomButtonProps) => {
  const tokens = variantTokens[variant]

  if (!tokens) {
    return <AntButton {...props}>{children}</AntButton>
  }

  return (
    <ConfigProvider theme={{ inherit: true, components: { Button: tokens } }}>
      <AntButton {...props}>{children}</AntButton>
    </ConfigProvider>
  )
}
