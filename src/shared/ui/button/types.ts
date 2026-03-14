import type { ButtonProps } from 'antd'

type ButtonVariant = 'default' | 'accent' | 'secondary'

export type CustomButtonProps = Omit<ButtonProps, 'variant'> & {
  variant?: ButtonVariant
}
