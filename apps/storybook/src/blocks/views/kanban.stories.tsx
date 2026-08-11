import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import {
  Kanban,
  KanbanBadge,
  KanbanCard,
  KanbanCardContent,
  KanbanCardDescription,
  KanbanCardFooter,
  KanbanCardHeader,
  KanbanCardSkeleton,
  KanbanCardTitle,
} from 'tc96/blocks'

interface Task {
  id: string
  title: string
  description: string
  owner: string
  priority: string
}

const tasks: Task[] = [
  {
    description: 'Align the public examples with the canonical package API.',
    id: 'task-1',
    owner: 'Alex',
    priority: 'High',
    title: 'Review TC96 stories',
  },
  {
    description: 'Confirm the grouped view taxonomy for the visual catalog.',
    id: 'task-2',
    owner: 'Jordan',
    priority: 'Medium',
    title: 'Organize collection views',
  },
  {
    description: 'Validate package, browser stories, and documentation builds.',
    id: 'task-3',
    owner: 'Sam',
    priority: 'Low',
    title: 'Run release checks',
  },
]

const columns = [
  { cards: tasks.slice(0, 2), count: 2, id: 'backlog', title: 'Backlog' },
  { cards: tasks.slice(2), count: 1, id: 'progress', title: 'In progress' },
  { cards: [], count: 0, id: 'done', title: 'Done' },
]

function TaskCard({ task }: Readonly<{ task: Task }>): React.ReactElement {
  return (
    <KanbanCard>
      <KanbanCardHeader>
        <KanbanCardTitle>{task.title}</KanbanCardTitle>
        <KanbanCardDescription>{task.description}</KanbanCardDescription>
      </KanbanCardHeader>
      <KanbanCardContent>
        <KanbanBadge>{task.priority}</KanbanBadge>
      </KanbanCardContent>
      <KanbanCardFooter className="justify-between">
        <span>{task.owner}</span>
        <span>{task.id}</span>
      </KanbanCardFooter>
    </KanbanCard>
  )
}

const meta = {
  title: 'Blocks/Views/Kanban',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="h-[34rem] w-[72rem] max-w-[calc(100vw-2rem)]">
      <Kanban
        columns={columns}
        emptyColumnLabel="No tasks in this stage."
        getCardLabel={(task) => task.title}
        getKey={(task) => task.id}
        renderCard={(task) => <TaskCard task={task} />}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Backlog' })).toBeVisible()
    await expect(canvas.getAllByText('Review TC96 stories')).toHaveLength(2)
    await expect(canvas.getByText('No tasks in this stage.')).toBeVisible()
  },
}

export const Card: Story = {
  render: () => (
    <div className="w-80">
      <TaskCard task={tasks[0]!} />
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="w-80">
      <KanbanCardSkeleton label="Loading task card" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status', { name: 'Loading task card' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
  },
}
