import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { DataGrid, type DataGridColumnDef, useDataGrid } from 'tc96/blocks'

interface RecordRow {
  id: string
  name: string
  owner: string
  status: string
}

const rows: RecordRow[] = [
  { id: 'record-1', name: 'TC96 framework', owner: 'Alex', status: 'In progress' },
  { id: 'record-2', name: 'Visual catalog', owner: 'Jordan', status: 'Backlog' },
  { id: 'record-3', name: 'Release checklist', owner: 'Sam', status: 'Done' },
]

const columns: DataGridColumnDef<RecordRow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: { fill: true, label: 'Name', type: 'title', variant: 'text' },
    size: 240,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { label: 'Status', type: 'status', variant: 'badge' },
    size: 160,
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    meta: { label: 'Owner', type: 'person', variant: 'text' },
    size: 160,
  },
]

function GridExample({ loading = false }: Readonly<{ loading?: boolean }>): React.ReactElement {
  const { table } = useDataGrid({
    columns,
    data: rows,
    getRowId: (row) => row.id,
  })

  return (
    <div className="w-[48rem] max-w-full">
      <DataGrid aria-label="Project records" isLoading={loading} table={table} />
    </div>
  )
}

const meta = {
  title: 'Blocks/Views/DataGrid',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => <GridExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('grid', { name: 'Project records' })).toBeVisible()
    await expect(canvas.getByText('TC96 framework')).toBeVisible()
  },
}

export const Loading: Story = {
  render: () => <GridExample loading />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('grid', { name: 'Project records' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
  },
}
