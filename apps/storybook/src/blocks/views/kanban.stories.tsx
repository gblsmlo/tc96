import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test'
import { useState } from 'react'
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
  type KanbanCardMove,
  type KanbanColumnData,
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
    description: 'Define the outcomes and constraints for the next release.',
    id: 'task-1',
    owner: 'Alex',
    priority: 'High',
    title: 'Plan release scope',
  },
  {
    description: 'Map dependencies before implementation starts.',
    id: 'task-2',
    owner: 'Jordan',
    priority: 'Medium',
    title: 'Map registry dependencies',
  },
  {
    description: 'Align the public examples with the canonical package API.',
    id: 'task-3',
    owner: 'Sam',
    priority: 'High',
    title: 'Review TC96 stories',
  },
  {
    description: 'Confirm the grouped view taxonomy for the visual catalog.',
    id: 'task-4',
    owner: 'Taylor',
    priority: 'Medium',
    title: 'Organize collection views',
  },
  {
    description: 'Keep keyboard and pointer movement equivalent.',
    id: 'task-5',
    owner: 'Morgan',
    priority: 'High',
    title: 'Implement accessible drag',
  },
  {
    description: 'Exercise overflow without exposing a scrollbar at rest.',
    id: 'task-6',
    owner: 'Alex',
    priority: 'Medium',
    title: 'Validate board scrolling',
  },
  {
    description: 'Check the visual contract in light and dark modes.',
    id: 'task-7',
    owner: 'Jordan',
    priority: 'Low',
    title: 'Review theme tokens',
  },
  {
    description: 'Confirm that consumer state accepts every card move.',
    id: 'task-8',
    owner: 'Sam',
    priority: 'High',
    title: 'Test optimistic updates',
  },
  {
    description: 'Validate package, browser stories, and documentation builds.',
    id: 'task-9',
    owner: 'Taylor',
    priority: 'Medium',
    title: 'Run release checks',
  },
  {
    description: 'Record the evidence required for publication.',
    id: 'task-10',
    owner: 'Morgan',
    priority: 'Low',
    title: 'Prepare release notes',
  },
]

const initialColumns: KanbanColumnData<Task>[] = [
  { cards: tasks.slice(0, 2), count: 2, id: 'plan', title: 'Plan' },
  { cards: tasks.slice(2, 4), count: 2, id: 'todo', title: 'Todo' },
  { cards: tasks.slice(4, 6), count: 2, id: 'in-progress', title: 'In Progress' },
  { cards: tasks.slice(6, 8), count: 2, id: 'in-review', title: 'In Review' },
  { cards: tasks.slice(8, 10), count: 2, id: 'done', title: 'Done' },
]

function cloneColumns(columns: KanbanColumnData<Task>[]): KanbanColumnData<Task>[] {
  return columns.map((column) => ({ ...column, cards: [...column.cards] }))
}

function moveTask(
  columns: KanbanColumnData<Task>[],
  move: KanbanCardMove<Task>,
): KanbanColumnData<Task>[] {
  const next = cloneColumns(columns)
  const source = next.find((column) => column.id === move.sourceColumnId)
  const target = next.find((column) => column.id === move.targetColumnId)
  if (!source || !target) return columns

  const sourceIndex = source.cards.findIndex((task) => task.id === move.cardId)
  if (sourceIndex < 0) return columns

  const [task] = source.cards.splice(sourceIndex, 1)
  if (!task) return columns

  const targetIndex = Math.max(
    0,
    Math.min(move.targetIndex ?? target.cards.length, target.cards.length),
  )
  target.cards.splice(targetIndex, 0, task)

  return next.map((column) => ({ ...column, count: column.cards.length }))
}

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

function WorkflowBoard(): React.ReactElement {
  const [columns, setColumns] = useState(() => cloneColumns(initialColumns))

  return (
    <div className="h-[34rem] w-[72rem] max-w-[calc(100vw-2rem)]">
      <Kanban
        columns={columns}
        emptyColumnLabel="No tasks in this status."
        getCardLabel={(task) => task.title}
        getKey={(task) => task.id}
        onMoveCard={(move) => {
          setColumns((current) => moveTask(current, move))
          return true
        }}
        renderCard={(task) => <TaskCard task={task} />}
      />
    </div>
  )
}

function draggableCard(canvasElement: HTMLElement, label: string): HTMLElement {
  const card = Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[data-kanban-card-draggable]'),
  ).find((candidate) => candidate.getAttribute('aria-label') === label)

  if (!card) throw new Error(`Missing draggable card: ${label}`)
  return card
}

function cardLabelsInColumn(card: HTMLElement): string[] {
  const column = card.closest<HTMLElement>('section[aria-labelledby]')
  if (!column) return []

  return Array.from(column.querySelectorAll<HTMLElement>('[data-kanban-card-draggable]')).map(
    (candidate) => candidate.getAttribute('aria-label') ?? '',
  )
}

async function nextAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

const meta = {
  title: 'Blocks/Views/Kanban',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Workflow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Five-status workflow with ten cards. Cards can be reordered vertically or moved horizontally between statuses; consumer state persists each accepted move.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const status of ['Plan', 'Todo', 'In Progress', 'In Review', 'Done']) {
      await expect(
        canvas.getByRole('button', { hidden: true, name: `${status} · 2` }),
      ).toBeInTheDocument()
    }

    await expect(
      canvasElement.querySelectorAll('[data-kanban-card-draggable]'),
    ).toHaveLength(10)
  },
  render: () => <WorkflowBoard />,
}

export const MovementAcceptance: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const secondPlanCard = draggableCard(canvasElement, 'Mover card Map registry dependencies')

    await waitFor(() => expect(secondPlanCard).toHaveAttribute('tabindex', '0'))
    secondPlanCard.focus()
    await userEvent.keyboard('[Space][ArrowUp][Space]')
    await waitFor(() =>
      expect(cardLabelsInColumn(secondPlanCard)).toEqual([
        'Mover card Map registry dependencies',
        'Mover card Plan release scope',
      ]),
    )

    const source = draggableCard(canvasElement, 'Mover card Plan release scope')
    const target = draggableCard(canvasElement, 'Mover card Review TC96 stories')
    const sourceRect = source.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const sourcePoint = {
      clientX: sourceRect.left + sourceRect.width / 2,
      clientY: sourceRect.top + sourceRect.height / 2,
    }
    const targetPoint = {
      clientX: targetRect.left + targetRect.width / 2,
      clientY: targetRect.top + targetRect.height / 4,
    }

    fireEvent.pointerDown(source, {
      ...sourcePoint,
      button: 0,
      buttons: 1,
      isPrimary: true,
      pointerId: 1,
      pointerType: 'mouse',
    })
    await nextAnimationFrame()
    fireEvent.pointerMove(source, {
      ...sourcePoint,
      buttons: 1,
      clientX: sourcePoint.clientX + 12,
      isPrimary: true,
      pointerId: 1,
      pointerType: 'mouse',
    })
    await waitFor(() => expect(source).toHaveAttribute('aria-grabbed', 'true'))
    fireEvent.pointerMove(target, {
      ...targetPoint,
      buttons: 1,
      isPrimary: true,
      pointerId: 1,
      pointerType: 'mouse',
    })
    await nextAnimationFrame()
    fireEvent.pointerUp(target, {
      ...targetPoint,
      button: 0,
      buttons: 0,
      isPrimary: true,
      pointerId: 1,
      pointerType: 'mouse',
    })

    await waitFor(() =>
      expect(cardLabelsInColumn(target)).toContain('Mover card Plan release scope'),
    )
    await expect(cardLabelsInColumn(secondPlanCard)).toEqual([
      'Mover card Map registry dependencies',
    ])
  },
  render: () => <WorkflowBoard />,
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
