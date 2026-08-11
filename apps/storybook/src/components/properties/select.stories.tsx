import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { SelectProperty } from 'tc96/components'
import { type Status, statusOptions } from './fixtures'

const meta = { title: 'Components/Properties/Select' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const StatusValue: Story = {
  render: () => <SelectExample />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Status: In progress' }),
    ).toBeVisible()
  },
}

function SelectExample(): React.ReactElement {
  const [value, setValue] = useState<Status>('progress')
  return (
    <SelectProperty ariaLabel="Status" onValueChange={setValue} options={statusOptions} value={value} />
  )
}
