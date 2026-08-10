'use client'

import type React from 'react'
import { Button } from '@/components/ui/button'
import { PopoverTrigger } from '@/components/ui/popover'
import { SelectPrimitive } from '@/components/ui/select'
import { cn } from '../../lib/utils'

export const propertyTriggerButtonClassName =
  'h-8 max-w-full min-w-0 justify-start rounded-md bg-transparent px-2 text-sm shadow-none before:rounded-[calc(var(--radius-md)-1px)] sm:h-8'

export interface PropertyTriggerButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'size' | 'variant'> { }

export function PropertyTriggerButton({
  className,
  ...props
}: Readonly<PropertyTriggerButtonProps>): React.ReactElement {
  return (
    <Button
      className={cn(propertyTriggerButtonClassName, 'data-popup-open:bg-accent', className)}
      data-slot="property-trigger"
      size="sm"
      variant="ghost"
      {...props}
    />
  )
}

export interface PropertySelectTriggerProps
  extends Omit<SelectPrimitive.Trigger.Props, 'className' | 'render'> {
  className?: string
}

export function PropertySelectTrigger({
  children,
  className,
  ...props
}: Readonly<PropertySelectTriggerProps>): React.ReactElement {
  return (
    <SelectPrimitive.Trigger
      data-slot="property-trigger"
      render={<PropertyTriggerButton className={className} />}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  )
}

export interface PropertyPopoverTriggerProps
  extends Omit<React.ComponentProps<typeof PopoverTrigger>, 'className' | 'render'> {
  className?: string
}

export function PropertyPopoverTrigger({
  children,
  className,
  ...props
}: Readonly<PropertyPopoverTriggerProps>): React.ReactElement {
  return (
    <PopoverTrigger
      data-slot="property-trigger"
      render={<PropertyTriggerButton className={className} />}
      {...props}
    >
      {children}
    </PopoverTrigger>
  )
}
