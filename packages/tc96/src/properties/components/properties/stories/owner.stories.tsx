import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { PersonProperty } from '../person'
import { type ExamplePerson, people } from './property-story-fixtures'
import { storyParameters } from './property-story-meta'
import systemPrompt from './prompts/owner.system-prompt.md?raw'

const meta = {
  component: PersonProperty,
  tags: ['autodocs'],
  title: 'Owner',
} satisfies Meta<typeof PersonProperty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: people,
    value: 'alex',
  },
  parameters: storyParameters(
    'A nullable single-person property. Options can provide an avatar, name, and optional description without encoding ownership rules in the package.',
    systemPrompt,
  ),
  render: () => <OwnerStory />,
}

function OwnerStory() {
  const [value, setValue] = useState<ExamplePerson | null>('alex')

  return (
    <PersonProperty
      ariaLabel="Owner"
      clearLabel="Remove owner"
      options={people}
      placeholder="No owner"
      value={value}
      onValueChange={setValue}
    />
  )
}
