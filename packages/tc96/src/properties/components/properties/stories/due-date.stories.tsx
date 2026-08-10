import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DateProperty } from '../date'
import { storyParameters } from './property-story-meta'
import systemPrompt from './prompts/due-date.system-prompt.md?raw'

const meta = {
  component: DateProperty,
  tags: ['autodocs'],
  title: 'Due Date',
} satisfies Meta<typeof DateProperty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '2026-07-18T12:00:00.000Z',
  },
  parameters: storyParameters(
    'A deadline composition over DateProperty. The consumer calculates deadline state.',
    systemPrompt,
  ),
  render: () => <DueDateStory />,
}

function DueDateStory() {
  const [value, setValue] = useState<string | null>('2026-07-18T12:00:00.000Z')

  return (
    <DateProperty
      ariaLabel="Due date"
      clearLabel="Clear due date"
      fallback="No due date"
      locale="en-US"
      timeZone="UTC"
      value={value}
      onValueChange={setValue}
    />
  )
}
