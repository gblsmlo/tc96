import type { HTMLAttributes } from 'react'
import { cn } from 'tc96/utils'

export function StatusPill({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('inline-flex rounded-full bg-secondary px-2 py-1 text-sm', className)}
      {...props}
    />
  )
}
