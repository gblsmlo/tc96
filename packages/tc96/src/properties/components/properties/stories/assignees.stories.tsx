import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { MultiPersonProperty } from '../person'
import { type ExamplePerson, people } from './property-story-fixtures'
import { storyParameters } from './property-story-meta'
import systemPrompt from './prompts/assignees.system-prompt.md?raw'

const meta = {
  component: MultiPersonProperty,
  tags: ['autodocs'],
  title: 'Assignees',
} satisfies Meta<typeof MultiPersonProperty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: people,
    value: ['alex', 'jordan'],
  },
  parameters: storyParameters(
    'A controlled multi-person property. Selected people are summarized in a compact button and can be added or removed from the popup.',
    systemPrompt,
  ),
  render: () => <AssigneesStory />,
}

function AssigneesStory() {
  const [value, setValue] = useState<readonly ExamplePerson[]>(['alex', 'jordan'])

  return (
    <MultiPersonProperty
      ariaLabel="Assignees"
      options={people}
      placeholder="Add assignees"
      value={value}
      onValueChange={setValue}
    />
  )
}
