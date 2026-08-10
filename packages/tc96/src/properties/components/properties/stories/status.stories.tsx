import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SelectProperty } from '../select'
import { type ExampleStatus, statusOptions } from './property-story-fixtures'
import { storyParameters } from './property-story-meta'
import systemPrompt from './prompts/status.system-prompt.md?raw'

const meta = {
  component: SelectProperty,
  tags: ['autodocs'],
  title: 'Status',
} satisfies Meta<typeof SelectProperty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: statusOptions,
    value: 'progress',
  },
  parameters: storyParameters(
    'A controlled single-choice status property. The trigger shows the current status and opens the complete consumer-provided status catalog.',
    systemPrompt,
  ),
  render: () => <StatusStory />,
}

function StatusStory() {
  const [value, setValue] = useState<ExampleStatus>('progress')

  return (
    <SelectProperty
      ariaLabel="Status"
      options={statusOptions}
      value={value}
      onValueChange={setValue}
    />
  )
}
