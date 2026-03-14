/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-base-to-string */
import type { FormItemProps } from 'antd'
import { Form, Tooltip } from 'antd'
import type { ReactElement } from 'react'
import { cloneElement, useEffect, useState } from 'react'

interface FormItemWithTooltipProps extends FormItemProps {
  children: ReactElement
}

/** Sits inside Form.Item — receives field props and shows error tooltip */
function TooltipWrapper({
  children,
  ...fieldProps
}: {
  children: ReactElement
  [key: string]: unknown
}) {
  const { errors } = Form.Item.useStatus()
  const hasError = errors.length > 0
  const errorText = errors.join('; ')

  // Keep last error text so tooltip doesn't go blank during fade-out
  const [lastText, setLastText] = useState('')
  if (errorText && errorText !== lastText) setLastText(errorText)

  // Open immediately (1ms), close with 150ms delay to absorb validation flicker
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setOpen(hasError), hasError ? 1 : 150)
    return () => clearTimeout(timer)
  }, [hasError])

  return (
    <Tooltip
      title={open ? lastText : undefined}
      open={open}
      placement="topRight"
      overlayClassName="error-tooltip"
      color="#DB2B21"
    >
      {cloneElement(children, fieldProps)}
    </Tooltip>
  )
}

export function FormItemWithTooltip(props: FormItemWithTooltipProps) {
  const { name, children, rules, label, required, ...itemProps } = props

  return (
    <Form.Item
      name={name}
      rules={rules}
      label={label}
      required={
        required ??
        rules?.some((r) => typeof r === 'object' && 'required' in r && r.required) ??
        false
      }
      {...itemProps}
      className="tooltip-validated"
    >
      <TooltipWrapper>{children}</TooltipWrapper>
    </Form.Item>
  )
}
