import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SelectProperty } from '../select'
import { type ExamplePriority, priorityOptions } from './property-story-fixtures'
import { storyParameters } from './property-story-meta'
import systemPrompt from './prompts/priority.system-prompt.md?raw'

const meta = {
  component: SelectProperty,
  tags: ['autodocs'],
  title: 'Priority',
} satisfies Meta<typeof SelectProperty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: priorityOptions,
    value: 'high',
  },
  parameters: storyParameters(
    'The default catalog demonstrates the recommended property-menu composition. Priority levels, labels, ordering, icons, and colors remain entirely consumer-supplied.',
    systemPrompt,
  ),
  render: () => <PriorityStory />,
}

function PriorityStory() {
  const [value, setValue] = useState<ExamplePriority>('high')

  return (
    <SelectProperty
      ariaLabel="Priority"
      options={priorityOptions}
      value={value}
      onValueChange={setValue}
    />
  )
}
