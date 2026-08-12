'use client'

import { CalendarDaysIcon } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverPopup } from '@/components/ui/popover'
import { PropertyPopoverTrigger, PropertyTriggerButton } from '../property-trigger'

export type DatePropertyDropdownPlacement = Pick<
  React.ComponentProps<typeof PopoverPopup>,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
>

export interface DatePropertyActionContext {
  date: Date | null
  previousValue: string | null
}

export interface DatePropertyProps {
  value: string | null
  action?: (value: string | null, context: DatePropertyActionContext) => void
  allowClear?: boolean
  ariaLabel?: string
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    'defaultMonth' | 'mode' | 'onSelect' | 'selected'
  >
  className?: string
  clearLabel?: string
  fallback?: string
  disabled?: boolean
  dropdownPlacement?: DatePropertyDropdownPlacement
  locale?: string
  readOnly?: boolean
  serializeDate?: (date: Date) => string
  timeZone?: string
  onValueChange?: (value: string | null) => void
}

export function DateProperty({
  action,
  allowClear = true,
  ariaLabel,
  calendarProps,
  className,
  clearLabel = 'Clear date',
  disabled = false,
  dropdownPlacement,
  fallback = 'No date',
  locale = 'en-US',
  onValueChange,
  readOnly = false,
  serializeDate = serializeDatePropertyValue,
  timeZone = 'UTC',
  value,
}: Readonly<DatePropertyProps>) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseDatePropertyValue(value)
  const accessibleLabel = ariaLabel ?? 'Date'
  const canUpdate = Boolean(action ?? onValueChange)

  const handleChange = (nextValue: string | null, date: Date | null) => {
    if (nextValue === value) {
      setOpen(false)
      return
    }

    if (action) {
      action(nextValue, {
        date,
        previousValue: value,
      })
    } else {
      onValueChange?.(nextValue)
    }
    setOpen(false)
  }

  if (readOnly || !canUpdate) {
    return (
      <DatePropertyButton
        className={className}
        fallback={fallback}
        locale={locale}
        timeZone={timeZone}
        value={value}
      />
    )
  }

  const label = formatDateProperty(value, fallback, locale, timeZone)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PropertyPopoverTrigger
        aria-label={`${accessibleLabel}: ${label}`}
        className={className}
        disabled={disabled}
      >
        <DatePropertyContent label={label} />
      </PropertyPopoverTrigger>
      <PopoverPopup align="start" className="w-auto" side="bottom" {...dropdownPlacement}>
        <Calendar
          defaultMonth={selectedDate ?? undefined}
          mode="single"
          selected={selectedDate ?? undefined}
          onSelect={(date) => {
            if (!date) return
            handleChange(serializeDate(date), date)
          }}
          {...calendarProps}
        />
        {allowClear ? (
          <div className="border-t p-2">
            <Button
              className="w-full justify-start"
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => handleChange(null, null)}
            >
              {clearLabel}
            </Button>
          </div>
        ) : null}
      </PopoverPopup>
    </Popover>
  )
}

export function DatePropertyButton({
  className,
  fallback = 'No date',
  locale = 'en-US',
  timeZone = 'UTC',
  value,
}: Readonly<Pick<DatePropertyProps, 'className' | 'fallback' | 'locale' | 'timeZone' | 'value'>>) {
  const label = formatDateProperty(value, fallback, locale, timeZone)

  return (
    <PropertyTriggerButton className={className}>
      <DatePropertyContent label={label} />
    </PropertyTriggerButton>
  )
}

function DatePropertyContent({ label }: Readonly<{ label: string }>) {
  return (
    <>
      <CalendarDaysIcon aria-hidden />
      <span className="truncate">{label}</span>
    </>
  )
}

export function formatDateProperty(
  value: string | null,
  fallback: string,
  locale: string,
  timeZone: string,
): string {
  const date = parseDatePropertyValue(value)
  if (!date) return fallback
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone,
  }).format(date)
}

export function parseDatePropertyValue(value: string | null): Date | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function serializeDatePropertyValue(date: Date): string {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12)).toISOString()
}
