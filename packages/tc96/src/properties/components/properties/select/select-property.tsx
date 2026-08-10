'use client'

import type React from 'react'
import { Select, SelectItem, SelectPopup } from '@/components/ui/select'
import { cn } from '../../../lib/utils'
import { PropertySelectTrigger, PropertyTriggerButton } from '../property-trigger'

export type SelectPropertyIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

export interface SelectPropertyOption<TValue extends string = string> {
  id: TValue
  label: string
  icon?: SelectPropertyIcon
  iconClassName?: string
}

type ResolvedSelectPropertyOption<TValue extends string = string> = SelectPropertyOption<TValue> & {
  value: TValue
}

export type SelectPropertyDropdownPlacement = Pick<
  React.ComponentProps<typeof SelectPopup>,
  'align' | 'alignItemWithTrigger' | 'alignOffset' | 'side' | 'sideOffset'
>

export interface SelectPropertyActionContext<TValue extends string = string> {
  option: SelectPropertyOption<TValue>
  previousValue: TValue
}

export interface SelectPropertyProps<TValue extends string = string> {
  value: TValue
  options: readonly SelectPropertyOption<TValue>[]
  action?: (value: TValue, context: SelectPropertyActionContext<TValue>) => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  dropdownClassName?: string
  dropdownPlacement?: SelectPropertyDropdownPlacement
  readOnly?: boolean
  onValueChange?: (value: TValue) => void
}

export function SelectProperty<TValue extends string = string>({
  action,
  ariaLabel,
  className,
  disabled = false,
  dropdownClassName,
  dropdownPlacement,
  onValueChange,
  options,
  readOnly = false,
  value,
}: Readonly<SelectPropertyProps<TValue>>) {
  const selectOptions = options.map((option) => ({ ...option, value: option.id }))
  const selectedOption = findSelectOption(selectOptions, value)
  const accessibleLabel = ariaLabel ?? 'Property'
  const canUpdate = Boolean(action ?? onValueChange)

  if (readOnly || !canUpdate) {
    return <SelectPropertyButton className={className} option={selectedOption} />
  }

  return (
    <Select
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      items={selectOptions}
      onValueChange={(option) => {
        if (option && option.value !== value) {
          if (action) {
            action(option.value, {
              option,
              previousValue: value,
            })
            return
          }
          onValueChange?.(option.value)
        }
      }}
      value={selectedOption}
    >
      <PropertySelectTrigger
        aria-label={`${accessibleLabel}: ${selectedOption.label}`}
        disabled={disabled}
        className={className}
      >
        <SelectPropertyContent option={selectedOption} />
      </PropertySelectTrigger>
      <SelectPopup
        alignItemWithTrigger={false}
        className={cn('min-w-56', dropdownClassName)}
        {...dropdownPlacement}
      >
        {selectOptions.map((option) => (
          <SelectItem key={option.value} value={option}>
            <SelectPropertyContent option={option} />
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

export function SelectPropertyButton<TValue extends string = string>({
  className,
  option,
}: Readonly<{
  className?: string
  option: SelectPropertyOption<TValue>
}>) {
  return (
    <PropertyTriggerButton className={className}>
      <SelectPropertyContent option={option} />
    </PropertyTriggerButton>
  )
}

function SelectPropertyContent<TValue extends string = string>({
  option,
}: Readonly<{ option: SelectPropertyOption<TValue> }>) {
  const Icon = option.icon
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {Icon ? <Icon aria-hidden className={cn(option.iconClassName)} /> : null}
      <span className="truncate">{option.label}</span>
    </span>
  )
}

function findSelectOption<TValue extends string>(
  options: readonly ResolvedSelectPropertyOption<TValue>[],
  value: TValue,
): ResolvedSelectPropertyOption<TValue> {
  const selectedOption = options.find((option) => option.value === value)
  if (selectedOption) return selectedOption
  return {
    id: value,
    label: value,
    value,
  }
}
