import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { DateProperty } from 'tc96/components'

const meta = { title: 'Components/Properties/Date' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const DateValue: Story = {
  render: () => <DateExample />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: /Due date:/ })).toBeVisible()
  },
}

function DateExample(): React.ReactElement {
  const [value, setValue] = useState<string | null>('2026-08-11T12:00:00.000Z')
  return (
    <DateProperty
      ariaLabel="Due date"
      locale="en-US"
      onValueChange={setValue}
      timeZone="UTC"
      value={value}
    />
  )
}
