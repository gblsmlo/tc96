import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { PersonProperty } from 'tc96/components'
import { type Person, people } from './fixtures'

const meta = { title: 'Components/Properties/Person' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const SelectedPerson: Story = {
  render: () => <PersonExample />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Owner: Alex Rivera' }),
    ).toBeVisible()
  },
}

function PersonExample(): React.ReactElement {
  const [value, setValue] = useState<Person | null>('alex')
  return (
    <PersonProperty ariaLabel="Owner" onValueChange={setValue} options={people} value={value} />
  )
}
