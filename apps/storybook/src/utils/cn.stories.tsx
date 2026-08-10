import type { Meta, StoryObj } from '@storybook/react-vite'
import { cn } from 'tc96/utils'

function UtilityContract(): React.ReactElement {
  return (
    <div className={cn('rounded-lg bg-secondary px-4 py-3 text-secondary-foreground')}>
      Classes compostas por <code>tc96/utils</code>
    </div>
  )
}

const meta = {
  title: 'Utils/cn',
  component: UtilityContract,
} satisfies Meta<typeof UtilityContract>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
