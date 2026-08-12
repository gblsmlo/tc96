import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DateProperty } from '../date'
import { storyParameters } from './property-story-meta'
import systemPrompt from './prompts/date.system-prompt.md?raw'

const meta = {
  component: DateProperty,
  tags: ['autodocs'],
  title: 'Date',
} satisfies Meta<typeof DateProperty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '2026-07-23T12:00:00.000Z',
  },
  parameters: storyParameters(
    'A nullable controlled date property with localized display, calendar selection, and an explicit clear action.',
    systemPrompt,
  ),
  render: () => <DateStory />,
}

function DateStory() {
  const [value, setValue] = useState<string | null>('2026-07-23T12:00:00.000Z')

  return (
    <DateProperty
      ariaLabel="Date"
      locale="en-US"
      timeZone="UTC"
      value={value}
      onValueChange={setValue}
    />
  )
}
