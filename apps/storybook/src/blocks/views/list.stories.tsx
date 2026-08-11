import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemFooter,
  ListItemHeader,
  ListItemSkeleton,
  ListItemTitle,
  ListView,
} from 'tc96/blocks'

interface Task {
  assigneeId: string | null
  id: string
  statusId: string
  title: string
  updatedAt: string
}

const items: Task[] = [
  { assigneeId: 'alex', id: 'task-1', statusId: 'backlog', title: 'Review stories', updatedAt: 'Today' },
  { assigneeId: 'jordan', id: 'task-2', statusId: 'progress', title: 'Validate views', updatedAt: 'Yesterday' },
  { assigneeId: null, id: 'task-3', statusId: 'done', title: 'Publish package', updatedAt: 'Aug 9' },
]

const collection = {
  assignees: [
    { id: 'alex', label: 'Alex' },
    { id: 'jordan', label: 'Jordan' },
  ],
  getAssigneeId: (item: Task) => item.assigneeId,
  getKey: (item: Task) => item.id,
  getLabel: (item: Task) => item.title,
  getStatusId: (item: Task) => item.statusId,
  items,
  statuses: [
    { id: 'backlog', label: 'Backlog' },
    { id: 'progress', label: 'In progress' },
    { id: 'done', label: 'Done' },
  ],
}

function TaskItem({ task }: Readonly<{ task: Task }>): React.ReactElement {
  return (
    <ListItem>
      <ListItemHeader>
        <ListItemTitle>{task.title}</ListItemTitle>
        <ListItemDescription>{task.id}</ListItemDescription>
      </ListItemHeader>
      <ListItemContent>{task.assigneeId ?? 'Unassigned'}</ListItemContent>
      <ListItemFooter>{task.updatedAt}</ListItemFooter>
    </ListItem>
  )
}

const meta = {
  title: 'Blocks/Views/List',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="w-[52rem] max-w-full">
      <ListView
        collection={collection}
        grouping="status"
        renderItem={(item) => <TaskItem task={item} />}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const collapse = canvas.getByRole('button', { name: 'Collapse Backlog' })

    await expect(canvas.getByText('Review stories')).toBeVisible()
    await userEvent.click(collapse)
    await waitFor(() => expect(canvas.queryByText('Review stories')).toBeNull())
    await expect(canvas.getByRole('button', { name: 'Expand Backlog' })).toBeVisible()
  },
}

export const Item: Story = {
  render: () => (
    <div className="w-[40rem] max-w-full">
      <TaskItem task={items[0]!} />
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="w-[40rem] max-w-full">
      <ListItemSkeleton label="Loading list item" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status', { name: 'Loading list item' })).toBeVisible()
  },
}
