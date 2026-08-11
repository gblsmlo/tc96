import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { MultiPersonProperty } from 'tc96/components'
import { type Person, people } from './fixtures'

const meta = { title: 'Components/Properties/Multi Person' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const SelectedPeople: Story = {
  render: () => <MultiPersonExample />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Assignees: Alex Rivera, Jordan Lee' }),
    ).toBeVisible()
  },
}

function MultiPersonExample(): React.ReactElement {
  const [value, setValue] = useState<readonly Person[]>(['alex', 'jordan'])
  return (
    <MultiPersonProperty
      ariaLabel="Assignees"
      onValueChange={setValue}
      options={people}
      value={value}
    />
  )
}
