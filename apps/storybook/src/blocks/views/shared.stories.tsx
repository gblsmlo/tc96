import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { CollectionProvider, CollectionSettingsMenu, CollectionToolbar, CollectionToolbarGroup } from 'tc96/blocks'
import { Button } from 'tc96/ui'

const collection = {
  assignees: [],
  getAssigneeId: () => null,
  getKey: (item: string) => item,
  getLabel: (item: string) => item,
  getStatusId: () => null,
  items: ['TC96'],
  statuses: [],
}

const meta = {
  title: 'Blocks/Views/Shared',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Toolbar: Story = {
  render: () => (
    <CollectionProvider collection={collection}>
      <CollectionToolbar className="w-[40rem] max-w-full">
        <CollectionToolbarGroup>
          <Button variant="secondary">Filters</Button>
        </CollectionToolbarGroup>
        <CollectionToolbarGroup>
          <CollectionSettingsMenu />
        </CollectionToolbarGroup>
      </CollectionToolbar>
    </CollectionProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Filters' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Settings' })).toBeVisible()
  },
}
