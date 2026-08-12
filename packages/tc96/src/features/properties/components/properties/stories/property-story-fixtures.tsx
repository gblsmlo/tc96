import {
  BadgeAlertIcon,
  CircleIcon,
  EllipsisIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
} from 'lucide-react'
import type { PersonPropertyOption } from '../person'
import type { SelectPropertyOption } from '../select'

export type ExampleStatus = 'backlog' | 'progress' | 'done'

export const statusOptions: readonly SelectPropertyOption<ExampleStatus>[] = [
  { icon: CircleIcon, iconClassName: 'text-slate-500', id: 'backlog', label: 'Backlog' },
  { icon: CircleIcon, iconClassName: 'text-amber-500', id: 'progress', label: 'In progress' },
  { icon: CircleIcon, iconClassName: 'text-emerald-500', id: 'done', label: 'Done' },
]

export type ExamplePriority = 'none' | 'urgent' | 'high' | 'medium' | 'low'

export const priorityOptions: readonly SelectPropertyOption<ExamplePriority>[] = [
  { icon: EllipsisIcon, iconClassName: 'text-muted-foreground', id: 'none', label: 'No priority' },
  { icon: BadgeAlertIcon, iconClassName: 'text-muted-foreground', id: 'urgent', label: 'Urgent' },
  { icon: SignalHighIcon, iconClassName: 'text-muted-foreground', id: 'high', label: 'High' },
  { icon: SignalMediumIcon, iconClassName: 'text-muted-foreground', id: 'medium', label: 'Medium' },
  { icon: SignalLowIcon, iconClassName: 'text-muted-foreground', id: 'low', label: 'Low' },
]

export type ExamplePerson = 'alex' | 'jordan' | 'sam'

export const people: readonly PersonPropertyOption<ExamplePerson>[] = [
  {
    avatar: { fallback: 'AR' },
    description: 'alex@example.com',
    name: 'Alex Rivera',
    value: 'alex',
  },
  {
    avatar: { fallback: 'JL' },
    description: 'jordan@example.com',
    name: 'Jordan Lee',
    value: 'jordan',
  },
  {
    avatar: { fallback: 'SK' },
    description: 'sam@example.com',
    name: 'Sam Kim',
    value: 'sam',
  },
]
