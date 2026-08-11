import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { StringProperty } from 'tc96/components'

const meta = { title: 'Components/Properties/String' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Editable: Story = {
  render: () => <StringExample />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Title' })
    await userEvent.clear(input)
    await userEvent.type(input, 'Unified framework')
    await expect(input).toHaveValue('Unified framework')
  },
}

function StringExample(): React.ReactElement {
  const [value, setValue] = useState('TC96 framework')
  return <StringProperty ariaLabel="Title" onValueChange={setValue} value={value} />
}
