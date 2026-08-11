import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlannedView } from './planned-view'

const meta = { title: 'Blocks/Views/Timeline' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Planned: Story = { render: () => <PlannedView name="Timeline" /> }
