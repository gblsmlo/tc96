import type { PersonPropertyOption, SelectPropertyOption } from 'tc96/components'

export type Status = 'backlog' | 'progress' | 'done'

export const statusOptions: readonly SelectPropertyOption<Status>[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'progress', label: 'In progress' },
  { id: 'done', label: 'Done' },
]

export type Person = 'alex' | 'jordan' | 'sam'

export const people: readonly PersonPropertyOption<Person>[] = [
  { avatar: { fallback: 'AR' }, description: 'alex@example.com', name: 'Alex Rivera', value: 'alex' },
  { avatar: { fallback: 'JL' }, description: 'jordan@example.com', name: 'Jordan Lee', value: 'jordan' },
  { avatar: { fallback: 'SK' }, description: 'sam@example.com', name: 'Sam Kim', value: 'sam' },
]
