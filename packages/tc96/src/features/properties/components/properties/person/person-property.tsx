'use client'

import { UserPlusIcon, XIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectItem, SelectPopup } from '@/components/ui/select'
import { cn } from '../../../lib/utils'
import { PropertySelectTrigger, PropertyTriggerButton } from '../property-trigger'

export interface PersonPropertyAvatar {
  fallback?: string
  src?: string
}

export interface PersonPropertyOption<TValue extends string = string> {
  value: TValue
  avatar?: PersonPropertyAvatar
  description?: string
  name: string
}

export type PersonPropertyDropdownPlacement = Pick<
  React.ComponentProps<typeof SelectPopup>,
  'align' | 'alignItemWithTrigger' | 'alignOffset' | 'side' | 'sideOffset'
>

export interface PersonPropertyActionContext<TValue extends string = string> {
  option: PersonPropertyOption<TValue> | null
  previousValue: TValue | null
}

export interface PersonPropertyProps<TValue extends string = string> {
  value: TValue | null
  options: readonly PersonPropertyOption<TValue>[]
  action?: (value: TValue | null, context: PersonPropertyActionContext<TValue>) => void
  allowClear?: boolean
  ariaLabel?: string
  className?: string
  clearLabel?: string
  disabled?: boolean
  dropdownPlacement?: PersonPropertyDropdownPlacement
  placeholder?: string
  readOnly?: boolean
  onValueChange?: (value: TValue | null) => void
}

interface ClearPersonOption {
  clear: true
  label: string
  value: null
}

type ResolvedPersonPropertyOption<TValue extends string> = PersonPropertyOption<TValue> & {
  label: string
}

type PersonSelectOption<TValue extends string> = PersonPropertyOption<TValue> | ClearPersonOption

type ResolvedPersonSelectOption<TValue extends string> =
  | ResolvedPersonPropertyOption<TValue>
  | ClearPersonOption

export function PersonProperty<TValue extends string = string>({
  action,
  allowClear = true,
  ariaLabel,
  className,
  clearLabel = 'Clear person',
  disabled = false,
  dropdownPlacement,
  onValueChange,
  options,
  placeholder = 'Unassigned',
  readOnly = false,
  value,
}: Readonly<PersonPropertyProps<TValue>>) {
  const resolvedOptions = options.map(resolvePersonOption)
  const selectedOption = value ? findPersonOption(resolvedOptions, value) : null
  const selectOptions: readonly ResolvedPersonSelectOption<TValue>[] = allowClear
    ? [...resolvedOptions, { clear: true, label: clearLabel, value: null }]
    : resolvedOptions
  const accessibleLabel = ariaLabel ?? 'Person'
  const canUpdate = Boolean(action ?? onValueChange)

  if (readOnly || !canUpdate) {
    return (
      <PersonPropertyButton
        className={className}
        option={selectedOption}
        placeholder={placeholder}
      />
    )
  }

  return (
    <Select
      itemToStringLabel={(option) => getPersonOptionName(option)}
      itemToStringValue={(option) => option.value ?? ''}
      items={selectOptions}
      onValueChange={(option) => {
        if (option && option.value !== value) {
          const nextOption = isClearPersonOption(option) ? null : option
          if (action) {
            action(option.value, {
              option: nextOption,
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
        aria-label={`${accessibleLabel}: ${selectedOption?.name ?? placeholder}`}
        disabled={disabled}
        className={className}
      >
        <PersonPropertyContent option={selectedOption} placeholder={placeholder} />
      </PropertySelectTrigger>
      <SelectPopup alignItemWithTrigger={false} {...dropdownPlacement}>
        {selectOptions.map((option) => (
          <SelectItem
            aria-label={getPersonOptionName(option)}
            className="data-selected:bg-accent"
            key={option.value ?? '__clear-person__'}
            value={option}
          >
            {isClearPersonOption(option) ? (
              <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                <XIcon aria-hidden />
                <span className="truncate">{option.label}</span>
              </span>
            ) : (
              <PersonPropertyContent option={option} placeholder={placeholder} showDescription />
            )}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

function isClearPersonOption<TValue extends string>(
  option: PersonSelectOption<TValue>,
): option is ClearPersonOption {
  return 'clear' in option
}

function getPersonOptionName<TValue extends string>(option: PersonSelectOption<TValue>): string {
  return isClearPersonOption(option) ? option.label : option.name
}

function resolvePersonOption<TValue extends string>(
  option: PersonPropertyOption<TValue>,
): ResolvedPersonPropertyOption<TValue> {
  return { ...option, label: option.name }
}

export function PersonPropertyButton<TValue extends string = string>({
  className,
  option,
  placeholder = 'Unassigned',
}: Readonly<{
  className?: string
  option: PersonPropertyOption<TValue> | null
  placeholder?: string
}>) {
  return (
    <PropertyTriggerButton className={className}>
      <PersonPropertyContent option={option} placeholder={placeholder} />
    </PropertyTriggerButton>
  )
}

function PersonPropertyContent<TValue extends string = string>({
  option,
  placeholder,
  showDescription = false,
}: Readonly<{
  option: PersonPropertyOption<TValue> | null
  placeholder: string
  showDescription?: boolean
}>) {
  if (!option) {
    return (
      <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
        <UserPlusIcon aria-hidden />
        <span className="truncate">{placeholder}</span>
      </span>
    )
  }

  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <Avatar className={cn(showDescription ? 'size-8 text-xs' : 'size-4 text-[0.625rem]')}>
        {option.avatar?.src ? <AvatarImage alt="" src={option.avatar.src} /> : null}
        <AvatarFallback>{option.avatar?.fallback ?? getInitials(option.name)}</AvatarFallback>
      </Avatar>
      <span className="min-w-0">
        <span className="block truncate">{option.name}</span>
        {showDescription && option.description ? (
          <span className="block truncate text-muted-foreground text-xs">{option.description}</span>
        ) : null}
      </span>
    </span>
  )
}

function findPersonOption<TValue extends string>(
  options: readonly PersonPropertyOption<TValue>[],
  value: TValue,
): PersonPropertyOption<TValue> {
  const selectedOption = options.find((option) => option.value === value)
  if (selectedOption) return selectedOption
  return {
    name: value,
    value,
  }
}

function getInitials(label: string): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
