import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from 'tc96/ui'

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Continue',
    onClick: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'outline',
        'destructive',
        'destructive-outline',
        'ghost',
        'link',
      ],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Loading: Story = {
  args: {
    children: 'Saving',
    loading: true,
  },
}

export const DestructiveOutline: Story = {
  args: {
    children: 'Remove',
    variant: 'destructive-outline',
  },
}
