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
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'outline',
        'destructive',
        'destructive-ghost',
        'destructive-outline',
        'ghost',
        'link',
      ],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
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
