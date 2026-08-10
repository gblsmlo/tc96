import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { StringProperty } from '../string'
import { storyParameters } from './property-story-meta'
import systemPrompt from './prompts/string.system-prompt.md?raw'

const meta = {
  component: StringProperty,
  tags: ['autodocs'],
  title: 'String',
} satisfies Meta<typeof StringProperty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 'Customer facing title',
  },
  parameters: storyParameters(
    'A neutral string property that edits free-form text. The consumer owns the label, validation, formatting, persistence, and any domain-specific semantics.',
    systemPrompt,
  ),
  render: () => <StringStory />,
}

function StringStory() {
  const [value, setValue] = useState('Customer facing title')

  return (
    <StringProperty
      ariaLabel="Title"
      placeholder="Enter a title"
      value={value}
      onValueChange={setValue}
    />
  )
}
