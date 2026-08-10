'use client'

import { Input } from '@/components/ui/input'
import { cn } from '../../../lib/utils'
import { PropertyTriggerButton } from '../property-trigger'

export interface StringPropertyActionContext {
  previousValue: string
}

export interface StringPropertyProps {
  value: string
  action?: (value: string, context: StringPropertyActionContext) => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  placeholder?: string
  readOnly?: boolean
  onValueChange?: (value: string) => void
}

export function StringProperty({
  action,
  ariaLabel,
  className,
  disabled = false,
  onValueChange,
  placeholder = 'No value',
  readOnly = false,
  value,
}: Readonly<StringPropertyProps>) {
  const accessibleLabel = ariaLabel ?? 'String'
  const canUpdate = Boolean(action ?? onValueChange)

  if (readOnly || !canUpdate) {
    return <StringPropertyButton ariaLabel={accessibleLabel} className={className} value={value} />
  }

  return (
    <Input
      aria-label={accessibleLabel}
      className={cn(className)}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue === value) return

        if (action) {
          action(nextValue, {
            previousValue: value,
          })
          return
        }

        onValueChange?.(nextValue)
      }}
    />
  )
}

export function StringPropertyButton({
  ariaLabel = 'String',
  className,
  placeholder = 'No value',
  value,
}: Readonly<{
  ariaLabel?: string
  className?: string
  placeholder?: string
  value: string
}>) {
  const label = value || placeholder

  return (
    <PropertyTriggerButton aria-label={`${ariaLabel}: ${label}`} className={cn(className)}>
      <span className={cn('truncate', !value && 'text-muted-foreground')}>{label}</span>
    </PropertyTriggerButton>
  )
}
