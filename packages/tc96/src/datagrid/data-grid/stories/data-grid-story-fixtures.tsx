import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from '../../components/button'
import { DataGrid } from '../data-grid'
import { createSelectColumn } from '../data-grid-columns'
import { DataGridPagination } from '../data-grid-pagination'
import {
  DataGridDensityMenu,
  DataGridFilterMenu,
  DataGridSearch,
  DataGridSelectionSummary,
  DataGridToolbar,
  DataGridToolbarGroup,
  DataGridViewOptions,
} from '../data-grid-toolbar'
import { DATA_GRID_COLUMN_TYPES, type DataGridColumnType, type DataGridDensity } from '../types'
import { useDataGrid } from '../use-data-grid'

interface ExampleRecord {
  category: string
  id: string
  name: string
  status: 'Draft' | 'Active' | 'Archived'
  updatedAt: string
}

interface DataGridExampleProps {
  actionLabel?: string
  allowRowAdd?: boolean
  data: ExampleRecord[]
  density?: DataGridDensity
  emptyMessage?: string
  initialSelectedId?: string
  isLoading?: boolean
  maxHeight?: number
  pinOuterColumns?: boolean
  showPagination?: boolean
  virtualize?: boolean
}

const columns: ColumnDef<ExampleRecord, unknown>[] = [
  {
    accessorKey: 'name',
    enableHiding: false,
    header: 'Nome',
    meta: { label: 'Nome', type: 'title', variant: 'text' },
    size: 280,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    meta: {
      editable: true,
      label: 'Estado',
      options: [
        { label: 'Rascunho', value: 'Draft' },
        { label: 'Ativo', value: 'Active' },
        { label: 'Arquivado', value: 'Archived' },
      ],
      type: 'status',
      variant: 'select',
    },
    size: 160,
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    meta: { label: 'Categoria', type: 'select', variant: 'badge' },
    size: 180,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Atualizado em',
    meta: { label: 'Atualizado em', type: 'last-edited-time', variant: 'text' },
    size: 160,
  },
]

const wideColumns: ColumnDef<ExampleRecord, unknown>[] = [
  {
    accessorKey: 'name',
    enableHiding: false,
    header: 'Nome',
    meta: { label: 'Nome', type: 'title', variant: 'text' },
    size: 280,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    meta: { label: 'Estado', type: 'status', variant: 'badge' },
    size: 180,
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    meta: { label: 'Categoria', type: 'select', variant: 'badge' },
    size: 220,
  },
  {
    accessorFn: (row) => (row.status === 'Active' ? 'Alta' : 'Média'),
    header: 'Prioridade',
    id: 'priority',
    meta: { label: 'Prioridade', type: 'select', variant: 'badge' },
    size: 220,
  },
  {
    accessorFn: (row) => `Responsável ${row.id.split('-').at(-1)}`,
    header: 'Responsável',
    id: 'owner',
    meta: { label: 'Responsável', type: 'person', variant: 'text' },
    size: 240,
  },
  {
    accessorFn: (row) => `REF-${row.id.split('-').at(-1)?.padStart(3, '0')}`,
    header: 'Referência',
    id: 'reference',
    meta: { label: 'Referência', type: 'id', variant: 'text' },
    size: 200,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Atualizado em',
    meta: { label: 'Atualizado em', type: 'last-edited-time', variant: 'text' },
    size: 180,
  },
]

export const records: ExampleRecord[] = [
  {
    category: 'Primária',
    id: 'record-1',
    name: 'Registro de exemplo A',
    status: 'Active',
    updatedAt: '2026-07-17',
  },
  {
    category: 'Secundária',
    id: 'record-2',
    name: 'Registro de exemplo B',
    status: 'Draft',
    updatedAt: '2026-07-16',
  },
  {
    category: 'Primária',
    id: 'record-3',
    name: 'Registro de exemplo C',
    status: 'Archived',
    updatedAt: '2026-07-15',
  },
  {
    category: 'Secundária',
    id: 'record-4',
    name: 'Registro de exemplo D',
    status: 'Active',
    updatedAt: '2026-07-14',
  },
]

export const overflowRecords: ExampleRecord[] = Array.from({ length: 80 }, (_, index) => {
  const source = records[index % records.length]!
  return {
    ...source,
    id: `record-${index + 1}`,
    name: `Registro de exemplo ${index + 1}`,
  }
})

const COLUMN_TYPE_LABELS = {
  title: 'Title',
  text: 'Text',
  number: 'Number',
  select: 'Select',
  'multi-select': 'Multi-select',
  status: 'Status',
  date: 'Date',
  formula: 'Formula',
  relation: 'Relation',
  rollup: 'Rollup',
  person: 'Person',
  file: 'File',
  checkbox: 'Checkbox',
  url: 'URL',
  email: 'Email',
  phone: 'Phone',
  'created-time': 'Created time',
  'created-by': 'Created by',
  'last-edited-time': 'Last edited time',
  'last-edited-by': 'Last edited by',
  button: 'Button',
  id: 'ID',
  place: 'Place',
} satisfies Record<DataGridColumnType, string>

type ColumnTypeRecord = Record<DataGridColumnType, string> & { id: string }

const columnTypeColumns: ColumnDef<ColumnTypeRecord, unknown>[] = DATA_GRID_COLUMN_TYPES.map(
  (type) => ({
    accessorFn: (row) => row[type],
    header: COLUMN_TYPE_LABELS[type],
    id: type,
    meta: { label: COLUMN_TYPE_LABELS[type], type, variant: 'text' },
    size: 160,
  }),
)

const columnTypeRecord = {
  id: 'column-types',
  ...Object.fromEntries(DATA_GRID_COLUMN_TYPES.map((type) => [type, COLUMN_TYPE_LABELS[type]])),
} as ColumnTypeRecord

export function DataGridExample({
  actionLabel,
  allowRowAdd = false,
  data,
  density,
  emptyMessage,
  initialSelectedId,
  isLoading,
  maxHeight,
  pinOuterColumns = false,
  showPagination = true,
  virtualize,
}: Readonly<DataGridExampleProps>) {
  const [rows, setRows] = useState(data)
  const selectableColumns = actionLabel
    ? [createSelectColumn<ExampleRecord>(), ...columns]
    : columns
  const { table } = useDataGrid<ExampleRecord>({
    columns: selectableColumns,
    data: rows,
    density,
    enablePagination: showPagination,
    enableRowSelection: Boolean(actionLabel),
    getRowId: (row) => row.id,
    onCellValueChange: ({ columnId, rowId, value }) => {
      setRows((current) =>
        current.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row)),
      )
    },
    pageSize: 3,
    tableOptions: {
      initialState: {
        columnPinning: pinOuterColumns
          ? { left: ['name'], right: ['updatedAt'] }
          : undefined,
        rowSelection: initialSelectedId ? { [initialSelectedId]: true } : undefined,
      },
    },
  })
  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div className="flex w-full max-w-6xl flex-col gap-3">
      <div className="w-fit max-w-full" style={{ width: table.getTotalSize() }}>
        <DataGridToolbar className="w-full justify-between">
          <DataGridToolbarGroup>
            <DataGridSearch placeholder="Buscar registros…" table={table} />
          </DataGridToolbarGroup>
          <DataGridToolbarGroup>
            {actionLabel && selectedCount > 0 ? (
              <>
                <DataGridSelectionSummary table={table} />
                <Button size="sm" variant="outline">
                  {actionLabel}
                </Button>
              </>
            ) : null}
            <DataGridFilterMenu table={table} />
            <DataGridDensityMenu table={table} />
            <DataGridViewOptions table={table} />
          </DataGridToolbarGroup>
        </DataGridToolbar>
        <DataGrid
          aria-label="Registros de exemplo"
          emptyMessage={emptyMessage}
          footer={showPagination ? <DataGridPagination table={table} /> : undefined}
          isLoading={isLoading}
          maxHeight={maxHeight}
          onRowAdd={
            allowRowAdd
              ? () =>
                  setRows((current) => [
                    ...current,
                    {
                      category: 'Primária',
                      id: `record-new-${current.length + 1}`,
                      name: `Novo registro ${current.length + 1}`,
                      status: 'Draft',
                      updatedAt: '2026-07-17',
                    },
                  ])
              : undefined
          }
          table={table}
          virtualize={virtualize}
        />
      </div>
    </div>
  )
}

export function ColumnTypesExample() {
  const { table } = useDataGrid<ColumnTypeRecord>({
    columns: columnTypeColumns,
    data: [columnTypeRecord],
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    getRowId: (row) => row.id,
  })

  return (
    <div className="w-full">
      <DataGrid aria-label="Column type catalog" table={table} />
    </div>
  )
}

export function WideDragScrollExample() {
  const { table } = useDataGrid<ExampleRecord>({
    columns: wideColumns,
    data: overflowRecords.slice(0, 12),
    enablePagination: false,
    getRowId: (row) => row.id,
    tableOptions: {
      initialState: {
        columnPinning: { left: ['name'], right: ['updatedAt'] },
      },
    },
  })

  return (
    <div className="w-full max-w-3xl">
      <DataGrid aria-label="Registros largos" maxHeight={420} table={table} />
    </div>
  )
}
