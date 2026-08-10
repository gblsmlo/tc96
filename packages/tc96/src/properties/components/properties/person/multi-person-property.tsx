'use client'

import { UserPlusIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectItem, SelectPopup } from '@/components/ui/select'
import { PropertySelectTrigger, PropertyTriggerButton } from '../property-trigger'
import type { PersonPropertyDropdownPlacement, PersonPropertyOption } from './person-property'

export interface MultiPersonPropertyActionContext<TValue extends string = string> {
  options: readonly PersonPropertyOption<TValue>[]
  previousValue: readonly TValue[]
}

export interface MultiPersonPropertyProps<TValue extends string = string> {
  value: readonly TValue[]
  options: readonly PersonPropertyOption<TValue>[]
  action?: (value: readonly TValue[], context: MultiPersonPropertyActionContext<TValue>) => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  dropdownPlacement?: PersonPropertyDropdownPlacement
  maxVisible?: number
  placeholder?: string
  readOnly?: boolean
  onValueChange?: (value: readonly TValue[]) => void
}

export function MultiPersonProperty<TValue extends string = string>({
  action,
  ariaLabel,
  className,
  disabled = false,
  dropdownPlacement,
  maxVisible = 3,
  onValueChange,
  options,
  placeholder = 'No people',
  readOnly = false,
  value,
}: Readonly<MultiPersonPropertyProps<TValue>>) {
  const resolvedOptions = options.map((option) => ({ ...option, label: option.name }))
  const selectedOptions = value.map((personValue) => findPersonOption(resolvedOptions, personValue))
  const accessibleLabel = ariaLabel ?? 'People'
  const canUpdate = Boolean(action ?? onValueChange)

  if (readOnly || !canUpdate) {
    return (
      <MultiPersonPropertyButton
        className={className}
        maxVisible={maxVisible}
        options={selectedOptions}
        placeholder={placeholder}
      />
    )
  }

  return (
    <Select
      itemToStringLabel={(option) => option.name}
      itemToStringValue={(option) => option.value}
      items={resolvedOptions}
      multiple
      value={selectedOptions}
      onValueChange={(nextOptions) => {
        const nextValue = nextOptions.map((option) => option.value)
        if (areValuesEqual(value, nextValue)) return

        if (action) {
          action(nextValue, { options: nextOptions, previousValue: value })
          return
        }
        onValueChange?.(nextValue)
      }}
    >
      <PropertySelectTrigger
        aria-label={`${accessibleLabel}: ${formatPersonLabels(selectedOptions, placeholder)}`}
        disabled={disabled}
        className={className}
      >
        <MultiPersonPropertyContent
          maxVisible={maxVisible}
          options={selectedOptions}
          placeholder={placeholder}
        />
      </PropertySelectTrigger>
      <SelectPopup alignItemWithTrigger={false} {...dropdownPlacement}>
        {resolvedOptions.map((option) => (
          <SelectItem
            aria-label={option.name}
            className="data-selected:bg-accent"
            key={option.value}
            value={option}
          >
            <PersonOptionContent option={option} />
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

export function MultiPersonPropertyButton<TValue extends string = string>({
  className,
  maxVisible = 3,
  options,
  placeholder = 'No people',
}: Readonly<{
  className?: string
  maxVisible?: number
  options: readonly PersonPropertyOption<TValue>[]
  placeholder?: string
}>) {
  return (
    <PropertyTriggerButton className={className}>
      <MultiPersonPropertyContent
        maxVisible={maxVisible}
        options={options}
        placeholder={placeholder}
      />
    </PropertyTriggerButton>
  )
}

function MultiPersonPropertyContent<TValue extends string>({
  maxVisible,
  options,
  placeholder,
}: Readonly<{
  maxVisible: number
  options: readonly PersonPropertyOption<TValue>[]
  placeholder: string
}>) {
  if (options.length === 0) {
    return (
      <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
        <UserPlusIcon aria-hidden />
        <span className="truncate">{placeholder}</span>
      </span>
    )
  }

  const visibleOptions = options.slice(0, Math.max(1, maxVisible))
  const hiddenCount = options.length - visibleOptions.length

  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <span className="flex shrink-0 -space-x-1">
        {visibleOptions.map((option) => (
          <PersonAvatar key={option.value} option={option} />
        ))}
      </span>
      <span className="truncate">{formatPersonLabels(visibleOptions, placeholder)}</span>
      {hiddenCount > 0 ? (
        <span className="text-muted-foreground text-xs">+{hiddenCount}</span>
      ) : null}
    </span>
  )
}

function PersonOptionContent<TValue extends string>({
  option,
}: Readonly<{ option: PersonPropertyOption<TValue> }>) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <PersonAvatar option={option} />
      <span className="min-w-0">
        <span className="block truncate">{option.name}</span>
        {option.description ? (
          <span className="block truncate text-muted-foreground text-xs">{option.description}</span>
        ) : null}
      </span>
    </span>
  )
}

function PersonAvatar<TValue extends string>({
  option,
}: Readonly<{ option: PersonPropertyOption<TValue> }>) {
  return (
    <Avatar className="size-6 border border-secondary text-[0.625rem]">
      {option.avatar?.src ? <AvatarImage alt="" src={option.avatar.src} /> : null}
      <AvatarFallback>{option.avatar?.fallback ?? getInitials(option.name)}</AvatarFallback>
    </Avatar>
  )
}

function findPersonOption<TValue extends string>(
  options: readonly PersonPropertyOption<TValue>[],
  value: TValue,
): PersonPropertyOption<TValue> {
  return options.find((option) => option.value === value) ?? { name: value, value }
}

function formatPersonLabels<TValue extends string>(
  options: readonly PersonPropertyOption<TValue>[],
  placeholder: string,
): string {
  return options.length > 0 ? options.map((option) => option.name).join(', ') : placeholder
}

function areValuesEqual<TValue extends string>(
  current: readonly TValue[],
  next: readonly TValue[],
): boolean {
  return current.length === next.length && current.every((value, index) => value === next[index])
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
