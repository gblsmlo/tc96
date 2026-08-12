import { afterEach, describe, expect, test, vi } from 'bun:test'
import { useState } from 'react'
import type { DataGridColumnDef, DataGridColumnType } from './index'

await import('../test/dom')

const { act, cleanup, fireEvent, render, screen, waitFor } = await import('@testing-library/react')
Object.assign(window, { PointerEvent: window.MouseEvent })
Object.assign(window, {
  cancelAnimationFrame: () => undefined,
  requestAnimationFrame: (callback: FrameRequestCallback) => {
    queueMicrotask(() => callback(0))
    return 1
  },
})
Object.assign(window.HTMLElement.prototype, {
  scrollTo(this: HTMLElement, options: ScrollToOptions) {
    this.scrollLeft = options.left ?? this.scrollLeft
    this.scrollTop = options.top ?? this.scrollTop
    this.dispatchEvent(new window.Event('scroll'))
  },
})
const { Button } = await import('../components/button')
const {
  DATA_GRID_COLUMN_TYPES,
  DATA_GRID_COLUMN_TYPE_ICONS,
  DataGrid,
  DataGridDensityMenu,
  DataGridFilterMenu,
  DataGridPagination,
  DataGridSearch,
  DataGridSelectionSummary,
  DataGridToolbar,
  DataGridViewOptions,
  createSelectColumn,
  useDataGrid,
} = await import('./index')

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

interface RowItem {
  id: string
  name: string
  note: string
}

interface SelectableRowItem extends RowItem {
  status: 'pending' | 'in-progress' | 'completed'
}

interface WideRowItem extends RowItem {
  owner: string
  priority: string
  status: string
  target: string
}

const expectedColumnTypes = [
  'title',
  'text',
  'number',
  'select',
  'multi-select',
  'status',
  'date',
  'formula',
  'relation',
  'rollup',
  'person',
  'file',
  'checkbox',
  'url',
  'email',
  'phone',
  'created-time',
  'created-by',
  'last-edited-time',
  'last-edited-by',
  'button',
  'id',
  'place',
] as const satisfies readonly DataGridColumnType[]

interface ColumnTypeRow {
  checkbox: boolean
  id: string
  multiSelect: string
  status: string
  text: string
}

function ColumnTypeGrid() {
  const columns: DataGridColumnDef<ColumnTypeRow>[] = [
    {
      accessorKey: 'text',
      header: 'Texto',
      meta: { label: 'Texto', type: 'text', variant: 'custom' },
    },
    {
      accessorKey: 'multiSelect',
      header: 'Multi-select',
      meta: { label: 'Multi-select', type: 'multi-select', variant: 'badge' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { label: 'Status', type: 'status', variant: 'badge' },
    },
    {
      accessorKey: 'checkbox',
      header: 'Checkbox',
      meta: { label: 'Checkbox', type: 'checkbox', variant: 'checkbox' },
    },
  ]
  const { table } = useDataGrid<ColumnTypeRow>({
    columns,
    data: [
      {
        checkbox: true,
        id: 'row-a',
        multiSelect: 'Alpha',
        status: 'Active',
        text: 'Custom text renderer',
      },
    ],
    getRowId: (row) => row.id,
  })

  return <DataGrid aria-label="Tipos de coluna" table={table} />
}

function SortedGrid() {
  const data: RowItem[] = [
    { id: 'row-a', name: 'Alpha', note: 'one' },
    { id: 'row-b', name: 'Zulu', note: 'two' },
  ]

  const columns: DataGridColumnDef<RowItem>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { label: 'Nome', type: 'title', variant: 'text' },
    },
    {
      accessorKey: 'note',
      header: 'Nota',
      meta: { label: 'Nota', type: 'text', variant: 'text' },
    },
  ]

  const { table } = useDataGrid<RowItem>({
    columns,
    data,
    getRowId: (row) => row.id,
    tableOptions: {
      initialState: {
        sorting: [{ desc: true, id: 'name' }],
      },
    },
  })

  return <DataGrid aria-label="Registros" table={table} />
}

function FoundationGrid() {
  const columns: DataGridColumnDef<RowItem>[] = [
    createSelectColumn<RowItem>(),
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { label: 'Nome', type: 'title', variant: 'text' },
    },
    {
      accessorKey: 'note',
      header: 'Nota',
      meta: { label: 'Nota', type: 'text', variant: 'text' },
    },
  ]

  const { table } = useDataGrid<RowItem>({
    columns,
    data: [
      { id: 'row-a', name: 'Alpha', note: 'one' },
      { id: 'row-b', name: 'Zulu', note: 'two' },
    ],
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    pageSize: 1,
  })

  return (
    <div>
      <DataGridToolbar aria-label="Ações dos registros">
        <DataGridSearch placeholder="Buscar registros…" table={table} />
        <DataGridSelectionSummary table={table} />
        <Button size="sm" variant="outline">
          Arquivar
        </Button>
        <DataGridFilterMenu table={table} />
        <DataGridDensityMenu table={table} />
        <DataGridViewOptions table={table} />
      </DataGridToolbar>
      <DataGrid
        aria-label="Registros compostos"
        footer={<DataGridPagination table={table} />}
        table={table}
      />
    </div>
  )
}

function SearchGrid({
  commitOnBlur,
  commitOnEnter,
  debounceMs = 500,
}: {
  commitOnBlur?: boolean
  commitOnEnter?: boolean
  debounceMs?: number
}) {
  const columns: DataGridColumnDef<RowItem>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { label: 'Nome', type: 'title', variant: 'text' },
    },
    {
      accessorKey: 'note',
      header: 'Nota',
      meta: { label: 'Nota', type: 'text', variant: 'text' },
    },
  ]
  const { table } = useDataGrid<RowItem>({
    columns,
    data: [
      { id: 'row-a', name: 'Alpha', note: 'one' },
      { id: 'row-b', name: 'Zulu', note: 'two' },
    ],
    getRowId: (row) => row.id,
  })

  return (
    <>
      <DataGridToolbar aria-label="Ações de busca">
        <DataGridSearch
          commitOnBlur={commitOnBlur}
          commitOnEnter={commitOnEnter}
          debounceMs={debounceMs}
          placeholder="Buscar registros"
          table={table}
        />
      </DataGridToolbar>
      <DataGrid aria-label="Registros buscáveis" table={table} />
    </>
  )
}

function GridWithInitialSelection() {
  const columns: DataGridColumnDef<RowItem>[] = [
    createSelectColumn<RowItem>(),
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { label: 'Nome', type: 'title', variant: 'text' },
    },
  ]
  const { table } = useDataGrid<RowItem>({
    columns,
    data: [{ id: 'row-a', name: 'Alpha', note: 'one' }],
    enableRowSelection: true,
    getRowId: (row) => row.id,
    tableOptions: { initialState: { rowSelection: { 'row-a': true } } },
  })

  return <DataGridSelectionSummary table={table} />
}

function MutablePinnedGrid() {
  const [data, setData] = useState<RowItem[]>([{ id: 'row-a', name: 'Alpha', note: 'one' }])
  const columns: DataGridColumnDef<RowItem>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { label: 'Nome', type: 'title', variant: 'text' },
    },
    {
      accessorKey: 'note',
      header: 'Nota',
      meta: { label: 'Nota', type: 'text', variant: 'text' },
    },
  ]
  const { table } = useDataGrid<RowItem>({
    columns,
    data,
    getRowId: (row) => row.id,
    tableOptions: { initialState: { columnPinning: { left: ['name'] } } },
  })

  return (
    <DataGrid
      aria-label="Registros editáveis"
      onRowAdd={() =>
        setData((current) => [...current, { id: 'row-b', name: 'Beta', note: 'two' }])
      }
      table={table}
    />
  )
}

function RightPinnedGrid({
  isLoading = false,
  pinBoth = false,
}: {
  isLoading?: boolean
  pinBoth?: boolean
}) {
  const columns: DataGridColumnDef<RowItem>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { fill: true, label: 'Nome', type: 'title', variant: 'text' },
      size: 120,
    },
    {
      accessorKey: 'note',
      header: 'Nota',
      meta: { label: 'Nota', type: 'text', variant: 'text' },
      size: 100,
    },
  ]
  const { table } = useDataGrid<RowItem>({
    columns,
    data: [{ id: 'row-a', name: 'Alpha', note: 'one' }],
    getRowId: (row) => row.id,
    tableOptions: {
      initialState: { columnPinning: { left: pinBoth ? ['name'] : [], right: ['note'] } },
    },
  })

  return (
    <DataGrid
      aria-label="Registros com coluna à direita"
      isLoading={isLoading}
      loadingRowCount={1}
      table={table}
    />
  )
}

function VirtualizedGrid() {
  const data: RowItem[] = Array.from({ length: 100 }, (_, index) => ({
    id: `row-${index + 1}`,
    name: `Registro ${index + 1}`,
    note: `Nota ${index + 1}`,
  }))
  const columns: DataGridColumnDef<RowItem>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { label: 'Nome', type: 'title', variant: 'text' },
    },
    {
      accessorKey: 'note',
      header: 'Nota',
      meta: { label: 'Nota', type: 'text', variant: 'text' },
    },
  ]
  const { table } = useDataGrid<RowItem>({ columns, data, getRowId: (row) => row.id })

  return <DataGrid aria-label="Registros virtualizados" maxHeight={180} table={table} virtualize />
}

function SingleSelectGrid() {
  const [data, setData] = useState<SelectableRowItem[]>([
    { id: 'row-a', name: 'Alpha', note: 'one', status: 'pending' },
  ])
  const columns: DataGridColumnDef<SelectableRowItem>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { label: 'Nome', type: 'title', variant: 'text' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: {
        editable: true,
        label: 'Status',
        options: [
          { label: 'Pendente', value: 'pending' },
          { label: 'Em andamento', value: 'in-progress' },
          { label: 'Concluída', value: 'completed' },
        ],
        type: 'status',
        variant: 'select',
      },
    },
  ]
  const { table } = useDataGrid<SelectableRowItem>({
    columns,
    data,
    getRowId: (row) => row.id,
    onCellValueChange: ({ columnId, rowId, value }) => {
      setData((current) =>
        current.map((row) =>
          row.id === rowId ? { ...row, [columnId]: value as SelectableRowItem['status'] } : row,
        ),
      )
    },
  })

  return <DataGrid aria-label="Registros com seleção única" table={table} />
}

function WideGrid({ fillTarget = false }: { fillTarget?: boolean }) {
  const columns: DataGridColumnDef<WideRowItem>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { label: 'Nome', type: 'title', variant: 'text' },
      size: 260,
    },
    {
      accessorKey: 'note',
      header: 'Nota',
      meta: { label: 'Nota', type: 'text', variant: 'text' },
      size: 260,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { label: 'Status', type: 'status', variant: 'badge' },
      size: 220,
    },
    {
      accessorKey: 'priority',
      header: 'Prioridade',
      meta: { label: 'Prioridade', type: 'select', variant: 'badge' },
      size: 220,
    },
    {
      accessorKey: 'owner',
      header: 'Responsável',
      meta: { label: 'Responsável', type: 'person', variant: 'text' },
      size: 240,
    },
    {
      accessorKey: 'target',
      header: 'Prazo',
      meta: { fill: fillTarget, label: 'Prazo', type: 'date', variant: 'text' },
      size: 200,
    },
  ]
  const { table } = useDataGrid<WideRowItem>({
    columns,
    data: [
      {
        id: 'row-a',
        name: 'Alpha',
        note: 'one',
        owner: 'Maria',
        priority: 'Alta',
        status: 'Ativo',
        target: '2026-07-18',
      },
    ],
    getRowId: (row) => row.id,
  })

  return <DataGrid aria-label="Registros largos" table={table} />
}

function WideGridWithSvgButton() {
  const [clickCount, setClickCount] = useState(0)
  const columns: DataGridColumnDef<WideRowItem>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      meta: { label: 'Nome', type: 'title', variant: 'text' },
      size: 260,
    },
    {
      id: 'actions',
      cell: () => (
        <button
          aria-label="Abrir Alpha"
          onClick={() => setClickCount((current) => current + 1)}
          type="button"
        >
          <svg aria-hidden="true" data-testid="row-action-icon" viewBox="0 0 16 16">
            <path d="M8 2l4 12H4L8 2z" />
          </svg>
        </button>
      ),
      header: 'Ações',
      meta: { label: 'Ações', type: 'button', variant: 'text' },
      size: 160,
    },
    {
      accessorKey: 'note',
      header: 'Nota',
      meta: { label: 'Nota', type: 'text', variant: 'text' },
      size: 260,
    },
  ]
  const { table } = useDataGrid<WideRowItem>({
    columns,
    data: [
      {
        id: 'row-a',
        name: 'Alpha',
        note: 'one',
        owner: 'Maria',
        priority: 'Alta',
        status: 'Ativo',
        target: '2026-07-18',
      },
    ],
    getRowId: (row) => row.id,
  })

  return (
    <>
      <DataGrid aria-label="Registros largos com ação" table={table} />
      <output aria-label="Cliques">{clickCount}</output>
    </>
  )
}

function defineHorizontalOverflow(element: HTMLElement) {
  Object.defineProperties(element, {
    clientWidth: { configurable: true, value: 360 },
    scrollWidth: { configurable: true, value: 1400 },
  })
}

function defineNoHorizontalOverflow(element: HTMLElement) {
  Object.defineProperties(element, {
    clientWidth: { configurable: true, value: 1400 },
    scrollWidth: { configurable: true, value: 1400 },
  })
}

function defineIncidentalHorizontalOverflow(element: HTMLElement) {
  Object.defineProperties(element, {
    clientWidth: { configurable: true, value: 1396 },
    scrollWidth: { configurable: true, value: 1404 },
  })
}

function definePointerCapture(element: HTMLElement) {
  let capturedPointerId: number | null = null
  const setPointerCapture = vi.fn((pointerId: number) => {
    capturedPointerId = pointerId
  })
  const releasePointerCapture = vi.fn((pointerId: number) => {
    if (capturedPointerId === pointerId) capturedPointerId = null
  })
  const hasPointerCapture = vi.fn((pointerId: number) => capturedPointerId === pointerId)

  Object.defineProperties(element, {
    hasPointerCapture: { configurable: true, value: hasPointerCapture },
    releasePointerCapture: { configurable: true, value: releasePointerCapture },
    setPointerCapture: { configurable: true, value: setPointerCapture },
  })

  return { hasPointerCapture, releasePointerCapture, setPointerCapture }
}

describe('DataGrid', () => {
  test('keeps columns hug-sized by default and only fills remaining space when opted in', () => {
    const { container, rerender } = render(<WideGrid />)
    const gridRoot = container.querySelector<HTMLElement>('[data-slot="data-grid"]')
    const targetHeader = container.querySelector<HTMLElement>(
      '[data-slot="data-grid-header-cell"][data-column-id="target"]',
    )

    expect(gridRoot?.classList.contains('w-fit')).toBe(true)
    expect(gridRoot?.classList.contains('max-w-full')).toBe(true)
    expect(gridRoot?.classList.contains('w-full')).toBe(false)
    expect(targetHeader?.style.flex).toBe('0 0 200px')

    rerender(<WideGrid fillTarget />)

    expect(targetHeader?.style.flex).toBe('1 0 200px')
  })

  test('exports an exhaustive icon registry for every column type', () => {
    expect(DATA_GRID_COLUMN_TYPES).toEqual(expectedColumnTypes)
    expect(Object.keys(DATA_GRID_COLUMN_TYPE_ICONS)).toEqual([...expectedColumnTypes])
    expect(new Set(Object.values(DATA_GRID_COLUMN_TYPE_ICONS)).size).toBe(
      expectedColumnTypes.length,
    )
  })

  test('renders decorative header icons from column type instead of cell variant', () => {
    const { container } = render(<ColumnTypeGrid />)

    for (const type of ['text', 'multi-select', 'status', 'checkbox'] as const) {
      const icon = container.querySelector(
        `[data-slot="data-grid-column-type-icon"][data-column-type="${type}"]`,
      )
      expect(icon).toBeTruthy()
      expect(icon?.getAttribute('aria-hidden')).toBe('true')
    }

    expect(screen.getByRole('button', { name: 'Opções da coluna Texto' })).toBeTruthy()
  })

  test('honors TanStack initial state in the foundation hook', () => {
    render(<GridWithInitialSelection />)

    expect(screen.getByText('1 selecionado')).toBeTruthy()
  })

  test('renders a continuous ARIA grid with reusable contextual actions', () => {
    const { container } = render(<FoundationGrid />)

    expect(screen.getByRole('toolbar', { name: 'Ações dos registros' })).toBeTruthy()
    const grid = screen.getByRole('grid', { name: 'Registros compostos' })
    expect(container.querySelector('[data-slot="scroll-area-viewport"]')).toBe(grid)
    expect(grid.getAttribute('aria-colcount')).toBe('3')
    expect(grid.getAttribute('aria-rowcount')).toBe('3')
    expect(grid.getAttribute('data-density')).toBe('short')
    expect(container.querySelector('[data-slot="data-grid-header"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="data-grid-body"]')).toBeTruthy()
    expect(container.querySelectorAll('[data-slot="data-grid-column-type-icon"]')).toHaveLength(2)
    expect(container.querySelector('[data-slot="card-frame"]')).toBeNull()
    expect(container.querySelector('[data-slot="card-frame-footer"]')).toBeNull()
    expect(screen.getByText('0 selecionados')).toBeTruthy()
    expect(
      screen
        .getByRole('checkbox', { name: 'Selecionar todos os registros' })
        .parentElement?.classList.contains('inset-0'),
    ).toBe(true)
    expect(
      container
        .querySelector('[data-slot="data-grid-header-cell"][data-column-id="select"]')
        ?.classList.contains('justify-center'),
    ).toBe(true)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar registro' }))

    expect(
      screen
        .getByRole('checkbox', { name: 'Selecionar registro' })
        .closest('[data-slot="data-grid-cell"]')
        ?.getAttribute('data-row-selected'),
    ).toBe('true')
    expect(screen.getByText('1 selecionado')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Arquivar' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Colunas' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Ordenar' })).toBeNull()
  })

  test('keeps search and pagination as opt-in composition', () => {
    render(<FoundationGrid />)

    expect(screen.getByText('1–1 de 2')).toBeTruthy()
    const alphaCell = screen.getByRole('gridcell', { name: 'Alpha' })
    fireEvent.click(alphaCell)
    expect(alphaCell.getAttribute('data-selected')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }))
    expect(screen.getByText('2–2 de 2')).toBeTruthy()
    const zuluCell = screen.getByRole('gridcell', { name: 'Zulu' })
    expect(zuluCell).toBeTruthy()
    expect(zuluCell.closest('[data-slot="data-grid-row"]')?.getAttribute('aria-rowindex')).toBe('3')
    expect(zuluCell.getAttribute('data-selected')).toBeNull()

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar registros…' }), {
      target: { value: 'Alpha' },
    })
    fireEvent.keyDown(screen.getByRole('searchbox', { name: 'Buscar registros…' }), {
      key: 'Enter',
    })

    expect(screen.getByRole('gridcell', { name: 'Alpha' })).toBeTruthy()
    expect(screen.queryByText('Zulu')).toBeNull()
  })

  test('supports row markers and roving keyboard focus between cells', () => {
    const { container } = render(<FoundationGrid />)

    expect(container.querySelector('[data-slot="data-grid-row-marker"]')?.textContent).toBe('1')
    expect(screen.queryByRole('button', { name: 'Opções da coluna select' })).toBeNull()

    const nameCell = screen.getByRole('gridcell', { name: 'Alpha' })
    const noteCell = screen.getByRole('gridcell', { name: 'one' })
    expect(nameCell.getAttribute('data-focused')).toBeNull()

    fireEvent.click(nameCell)
    expect(nameCell.getAttribute('aria-selected')).toBe('true')
    expect(nameCell.getAttribute('tabindex')).toBe('0')

    fireEvent.keyDown(nameCell, { key: 'ArrowRight' })

    expect(noteCell.getAttribute('data-focused')).toBe('true')
    expect(noteCell.getAttribute('tabindex')).toBe('0')
    expect(nameCell.getAttribute('tabindex')).toBe('-1')
  })

  test('enters the grid through one immediately navigable cell', () => {
    render(<SortedGrid />)

    const grid = screen.getByRole('grid', { name: 'Registros' })
    const gridCells = screen.getAllByRole('gridcell')
    const tabbableCells = gridCells.filter((cell) => cell.getAttribute('tabindex') === '0')

    expect(grid.getAttribute('tabindex')).toBe('-1')
    expect(tabbableCells).toHaveLength(1)

    const firstCell = tabbableCells[0]!
    firstCell.focus()
    fireEvent.keyDown(firstCell, { key: 'ArrowRight' })

    expect(screen.getByRole('gridcell', { name: 'two' }).getAttribute('data-focused')).toBe('true')
  })

  test('connects filter and density controls to the grid state', () => {
    render(<FoundationGrid />)

    const toolbar = screen.getByRole('toolbar', { name: 'Ações dos registros' })
    expect(toolbar.getAttribute('data-variant')).toBe('plain')
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Ordenar' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Compacta' })).toBeTruthy()
    expect(
      screen.getByRole('grid', { name: 'Registros compostos' }).getAttribute('data-density'),
    ).toBe('short')

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Filtrar Nome' }), {
      target: { value: 'Zulu' },
    })

    expect(screen.getByText('Zulu')).toBeTruthy()
    expect(screen.queryByText('Alpha')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))
  })

  test('bounds search updates while keeping the input responsive', async () => {
    vi.useFakeTimers()
    render(<SearchGrid />)

    const searchInput = screen.getByRole('searchbox', { name: 'Buscar registros' })
    fireEvent.change(searchInput, { target: { value: 'Zulu' } })

    expect((searchInput as HTMLInputElement).value).toBe('Zulu')
    expect(screen.getByText('Alpha')).toBeTruthy()
    expect(screen.getByText('Zulu')).toBeTruthy()

    act(() => vi.advanceTimersByTime(499))
    expect(screen.getByText('Alpha')).toBeTruthy()

    act(() => vi.advanceTimersByTime(1))

    await waitFor(() => {
      expect(screen.queryByText('Alpha')).toBeNull()
      expect(screen.getByText('Zulu')).toBeTruthy()
    })
  })

  test('commits pending search on Enter and blur', async () => {
    vi.useFakeTimers()
    render(<SearchGrid debounceMs={1000} />)

    const searchInput = screen.getByRole('searchbox', { name: 'Buscar registros' })
    fireEvent.change(searchInput, { target: { value: 'Alpha' } })
    fireEvent.keyDown(searchInput, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeTruthy()
      expect(screen.queryByText('Zulu')).toBeNull()
    })

    fireEvent.change(searchInput, { target: { value: 'Zulu' } })
    expect(screen.getByText('Alpha')).toBeTruthy()
    fireEvent.blur(searchInput)

    await waitFor(() => {
      expect(screen.queryByText('Alpha')).toBeNull()
      expect(screen.getByText('Zulu')).toBeTruthy()
    })
  })

  test('uses the whole column header trigger to toggle its menu without sorting implicitly', () => {
    const { container } = render(<SortedGrid />)

    const rowsBefore = screen.getAllByRole('row')
    expect(rowsBefore[1]!.textContent).toContain('Zulu')
    expect(rowsBefore[2]!.textContent).toContain('Alpha')

    const nameHeader = container.querySelector(
      '[data-slot="data-grid-header-cell"][data-column-id="name"]',
    )
    expect(nameHeader?.querySelectorAll('button')).toHaveLength(1)
    const headerTrigger = nameHeader?.querySelector('button')
    expect(headerTrigger?.getAttribute('aria-label')).toBe('Opções da coluna Nome')
    if (!headerTrigger) throw new Error('Header trigger de Nome não encontrado')
    fireEvent.click(headerTrigger)

    expect(screen.getByRole('menuitem', { name: 'Ordem crescente' })).toBeTruthy()
    expect(screen.getAllByRole('row')[1]!.textContent).toContain('Zulu')

    fireEvent.click(headerTrigger)
    expect(screen.queryByRole('menuitem', { name: 'Ordem crescente' })).toBeNull()

    fireEvent.click(headerTrigger)
    fireEvent.click(screen.getByRole('menuitem', { name: 'Ordem crescente' }))
    const rowsAfter = screen.getAllByRole('row')
    expect(rowsAfter[1]!.textContent).toContain('Alpha')
    expect(rowsAfter[2]!.textContent).toContain('Zulu')
  })

  test('keeps focus attached to the same logical cell after sorting rows', () => {
    render(<SortedGrid />)

    const alphaNote = screen.getByRole('gridcell', { name: 'one' })
    fireEvent.click(alphaNote)
    expect(alphaNote.getAttribute('data-focused')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Opções da coluna Nome' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Ordem crescente' }))

    expect(screen.getByRole('gridcell', { name: 'one' }).getAttribute('data-focused')).toBe('true')
    expect(screen.getByRole('gridcell', { name: 'two' }).getAttribute('data-focused')).toBeNull()
  })

  test('keeps selection attached to the same logical cell after reordering columns', () => {
    render(<SortedGrid />)

    const alphaName = screen.getByRole('gridcell', { name: 'Alpha' })
    fireEvent.click(alphaName)
    expect(alphaName.getAttribute('data-selected')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Opções da coluna Nome' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Mover para direita' }))

    expect(screen.getByRole('gridcell', { name: 'Alpha' }).getAttribute('data-selected')).toBe(
      'true',
    )
    expect(screen.getByRole('gridcell', { name: 'one' }).getAttribute('data-selected')).toBeNull()
  })

  test('reconciles focus and clears stale selection when a column disappears', () => {
    render(<FoundationGrid />)

    const alphaName = screen.getByRole('gridcell', { name: 'Alpha' })
    fireEvent.click(alphaName)
    expect(alphaName.getAttribute('data-selected')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Opções da coluna Nome' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Ocultar coluna' }))

    const noteCell = screen.getByRole('gridcell', { name: 'one' })
    expect(noteCell.getAttribute('data-focused')).toBe('true')
    expect(noteCell.getAttribute('data-selected')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Colunas' }))
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Nome' }))

    expect(screen.getByRole('gridcell', { name: 'Alpha' }).getAttribute('data-selected')).toBeNull()
    expect(screen.getByRole('gridcell', { name: 'one' }).getAttribute('data-focused')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Colunas' }))
    expect(screen.queryByRole('menuitemcheckbox', { name: 'Nome' })).toBeNull()
  })

  test('keeps pinning and row creation extensible through the consumer', () => {
    const { container } = render(<MutablePinnedGrid />)

    const pinnedHeader = container.querySelector<HTMLElement>(
      '[data-slot="data-grid-header-cell"][data-column-id="name"]',
    )
    const pinnedCell = container.querySelector<HTMLElement>(
      '[data-slot="data-grid-cell"][data-column-id="name"]',
    )

    expect(pinnedHeader?.getAttribute('data-pinned')).toBe('left')
    expect(
      pinnedCell?.classList.contains(
        'group-hover:data-[pinned]:bg-[color-mix(in_oklab,var(--accent)_40%,var(--background))]',
      ),
    ).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar linha' }))

    expect(screen.getByText('Beta')).toBeTruthy()
    expect(
      screen.getByRole('grid', { name: 'Registros editáveis' }).getAttribute('aria-rowcount'),
    ).toBe('4')
  })

  test('fills an opted-in unpinned column before a right-pinned column', () => {
    const { container } = render(<RightPinnedGrid />)
    const nameHeader = container.querySelector<HTMLElement>(
      '[data-slot="data-grid-header-cell"][data-column-id="name"]',
    )
    const nameCell = container.querySelector<HTMLElement>(
      '[data-slot="data-grid-cell"][data-column-id="name"]',
    )
    const noteHeader = container.querySelector<HTMLElement>(
      '[data-slot="data-grid-header-cell"][data-column-id="note"]',
    )

    expect(nameHeader?.style.flexGrow).toBe('1')
    expect(nameCell?.style.flexGrow).toBe('1')
    expect(noteHeader?.style.flexGrow).toBe('0')
    expect(noteHeader?.style.position).toBe('sticky')
    expect(noteHeader?.style.right).toBe('0px')
    expect(noteHeader?.style.boxShadow).toContain('-1px 0 0 var(--border)')
  })

  test('preserves left and right pinned offsets in loading rows', () => {
    const { container } = render(<RightPinnedGrid isLoading pinBoth />)
    const loadingCells = container.querySelectorAll<HTMLElement>(
      '[data-slot="data-grid-body"] [role="gridcell"]',
    )

    expect(loadingCells).toHaveLength(2)
    expect(loadingCells[0]!.style.position).toBe('sticky')
    expect(loadingCells[0]!.style.left).toBe('0px')
    expect(loadingCells[0]!.style.boxShadow).toContain('1px 0 0 var(--border)')
    expect(loadingCells[1]!.style.position).toBe('sticky')
    expect(loadingCells[1]!.style.right).toBe('0px')
    expect(loadingCells[1]!.style.boxShadow).toContain('-1px 0 0 var(--border)')
  })

  test('virtualizes long ungrouped collections without changing the grid contract', () => {
    const { container } = render(<VirtualizedGrid />)
    const grid = screen.getByRole('grid', { name: 'Registros virtualizados' })
    expect(typeof grid.scrollTo).toBe('function')

    expect(grid.getAttribute('aria-rowcount')).toBe('101')
    expect(
      container.querySelector('[data-slot="data-grid-body"]')?.getAttribute('data-virtualized'),
    ).toBe('true')
    expect(screen.getAllByRole('row').length).toBeLessThan(101)
    expect(screen.getByText('Registro 1')).toBeTruthy()
  })

  test('keeps keyboard focus continuous across virtualized windows', async () => {
    render(<VirtualizedGrid />)

    const grid = screen.getByRole('grid', { name: 'Registros virtualizados' })
    const firstCell = screen.getByRole('gridcell', { name: 'Registro 1' })
    fireEvent.click(firstCell)
    fireEvent.keyDown(firstCell, { ctrlKey: true, key: 'End' })
    expect(grid.scrollTop).toBeGreaterThan(0)

    await waitFor(() =>
      expect(screen.getByRole('gridcell', { name: 'Nota 100' }).getAttribute('data-focused')).toBe(
        'true',
      ),
    )
  })

  test('selects a single-select cell before opening its dropdown from the cell or badge', async () => {
    render(<SingleSelectGrid />)

    const trigger = screen.getByRole('combobox', { name: 'Status: Pendente' })
    const cell = trigger.closest<HTMLElement>('[data-slot="data-grid-cell"]')
    expect(cell).toBeTruthy()
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger.getAttribute('data-slot')).toBe('badge')
    expect(trigger.querySelector('[data-slot="select-icon"]')).toBeNull()

    fireEvent.pointerDown(trigger, { pointerId: 1, pointerType: 'mouse' })
    fireEvent.mouseDown(trigger)
    fireEvent.pointerUp(trigger, { pointerId: 1, pointerType: 'mouse' })
    fireEvent.click(trigger)
    expect(cell?.getAttribute('data-selected')).toBe('true')
    expect(screen.queryByRole('option', { name: 'Pendente' })).toBeNull()

    fireEvent.pointerDown(trigger, { pointerId: 2, pointerType: 'mouse' })
    fireEvent.mouseDown(trigger)
    fireEvent.pointerUp(trigger, { pointerId: 2, pointerType: 'mouse' })
    fireEvent.click(trigger)
    expect(screen.getByRole('option', { name: 'Pendente' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Em andamento' })).toBeTruthy()
    const completedOption = screen.getByRole('option', { name: 'Concluída' })
    fireEvent.pointerDown(completedOption, { pointerType: 'mouse' })
    fireEvent.click(completedOption)

    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Status: Concluída' })).toBeTruthy(),
    )
    expect(screen.getAllByRole('combobox')).toHaveLength(1)
  })

  test('opens a selected single-select cell when clicking outside its badge', async () => {
    render(<SingleSelectGrid />)

    const trigger = screen.getByRole('combobox', { name: 'Status: Pendente' })
    const cell = trigger.closest<HTMLElement>('[data-slot="data-grid-cell"]')
    expect(cell).toBeTruthy()
    if (!cell) throw new Error('Expected the status cell to exist')
    fireEvent.click(cell)
    expect(cell.getAttribute('data-selected')).toBe('true')
    expect(screen.queryByRole('option', { name: 'Pendente' })).toBeNull()

    fireEvent.click(cell)
    await waitFor(() => expect(screen.getByRole('option', { name: 'Pendente' })).toBeTruthy())

    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Status: Pendente' }), { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('option', { name: 'Pendente' })).toBeNull())
  })

  test('does not hijack arrow keys handled by an interactive cell control', () => {
    render(<SingleSelectGrid />)

    const nameCell = screen.getByRole('gridcell', { name: 'Alpha' })
    fireEvent.click(nameCell)
    expect(nameCell.getAttribute('data-focused')).toBe('true')

    const trigger = screen.getByRole('combobox', { name: 'Status: Pendente' })
    fireEvent.keyDown(trigger, { key: 'ArrowRight' })

    expect(nameCell.getAttribute('data-focused')).toBe('true')
  })

  test('drags an eligible grid surface horizontally after the movement threshold', () => {
    render(<WideGrid />)

    const grid = screen.getByRole('grid', { name: 'Registros largos' })
    defineHorizontalOverflow(grid)
    const pointerCapture = definePointerCapture(grid)
    const cell = screen.getByRole('gridcell', { name: 'Alpha' })
    grid.scrollLeft = 160

    fireEvent.pointerDown(cell, {
      button: 0,
      clientX: 220,
      clientY: 40,
      pointerId: 11,
      pointerType: 'mouse',
    })
    fireEvent.pointerMove(grid, {
      button: 0,
      buttons: 1,
      clientX: 160,
      clientY: 43,
      pointerId: 11,
      pointerType: 'mouse',
    })

    expect(pointerCapture.setPointerCapture).toHaveBeenCalledTimes(1)
    expect(grid.scrollLeft).toBe(220)
    expect(grid.getAttribute('data-drag-scroll')).toBe('dragging')

    fireEvent.pointerUp(grid, { clientX: 160, clientY: 43, pointerId: 11, pointerType: 'mouse' })
    expect(grid.getAttribute('data-drag-scroll')).toBeNull()

    fireEvent.click(cell, { clientX: 160, clientY: 43 })
    expect(cell.getAttribute('data-selected')).toBeNull()
  })

  test('does not drag scroll when the columns fit inside the grid viewport', () => {
    render(<WideGrid />)

    const grid = screen.getByRole('grid', { name: 'Registros largos' })
    defineNoHorizontalOverflow(grid)
    const pointerCapture = definePointerCapture(grid)
    const cell = screen.getByRole('gridcell', { name: 'Alpha' })
    grid.scrollLeft = 0

    fireEvent.pointerDown(cell, {
      button: 0,
      clientX: 220,
      clientY: 40,
      pointerId: 15,
      pointerType: 'mouse',
    })
    fireEvent.pointerMove(grid, {
      button: 0,
      buttons: 1,
      clientX: 140,
      clientY: 42,
      pointerId: 15,
      pointerType: 'mouse',
    })
    fireEvent.pointerUp(grid, { pointerId: 15, pointerType: 'mouse' })

    expect(grid.scrollLeft).toBe(0)
    expect(grid.getAttribute('data-drag-scroll')).toBeNull()
    expect(pointerCapture.setPointerCapture).not.toHaveBeenCalled()
  })

  test('does not drag scroll for incidental horizontal overflow within the gesture threshold', () => {
    render(<WideGrid />)

    const grid = screen.getByRole('grid', { name: 'Registros largos' })
    defineIncidentalHorizontalOverflow(grid)
    const pointerCapture = definePointerCapture(grid)
    const cell = screen.getByRole('gridcell', { name: 'Alpha' })
    grid.scrollLeft = 0

    fireEvent.pointerDown(cell, {
      button: 0,
      clientX: 220,
      clientY: 40,
      pointerId: 16,
      pointerType: 'mouse',
    })
    fireEvent.pointerMove(grid, {
      button: 0,
      buttons: 1,
      clientX: 140,
      clientY: 42,
      pointerId: 16,
      pointerType: 'mouse',
    })
    fireEvent.pointerUp(grid, { pointerId: 16, pointerType: 'mouse' })

    expect(grid.scrollLeft).toBe(0)
    expect(grid.getAttribute('data-drag-scroll')).toBeNull()
    expect(pointerCapture.setPointerCapture).not.toHaveBeenCalled()
  })

  test('preserves normal cell click behavior below the drag threshold', () => {
    render(<WideGrid />)

    const grid = screen.getByRole('grid', { name: 'Registros largos' })
    defineHorizontalOverflow(grid)
    const pointerCapture = definePointerCapture(grid)
    const cell = screen.getByRole('gridcell', { name: 'Alpha' })

    fireEvent.pointerDown(cell, {
      button: 0,
      clientX: 220,
      clientY: 40,
      pointerId: 12,
      pointerType: 'mouse',
    })
    fireEvent.pointerMove(grid, {
      button: 0,
      buttons: 1,
      clientX: 216,
      clientY: 40,
      pointerId: 12,
      pointerType: 'mouse',
    })
    fireEvent.pointerUp(grid, { pointerId: 12, pointerType: 'mouse' })
    fireEvent.click(cell)

    expect(grid.scrollLeft).toBe(0)
    expect(pointerCapture.setPointerCapture).not.toHaveBeenCalled()
    expect(cell.getAttribute('data-selected')).toBe('true')
  })

  test('does not start drag scrolling from interactive grid controls', () => {
    render(<WideGrid />)

    const grid = screen.getByRole('grid', { name: 'Registros largos' })
    defineHorizontalOverflow(grid)
    const pointerCapture = definePointerCapture(grid)
    const headerButton = screen.getByRole('button', { name: 'Opções da coluna Nome' })
    grid.scrollLeft = 160

    fireEvent.pointerDown(headerButton, {
      button: 0,
      clientX: 220,
      clientY: 20,
      pointerId: 13,
      pointerType: 'mouse',
    })
    fireEvent.pointerMove(grid, {
      button: 0,
      buttons: 1,
      clientX: 140,
      clientY: 20,
      pointerId: 13,
      pointerType: 'mouse',
    })
    fireEvent.pointerUp(grid, { pointerId: 13, pointerType: 'mouse' })
    fireEvent.click(headerButton)

    expect(grid.scrollLeft).toBe(160)
    expect(pointerCapture.setPointerCapture).not.toHaveBeenCalled()
    expect(screen.getByRole('menuitem', { name: 'Ordem crescente' })).toBeTruthy()
  })

  test('does not start drag scrolling from an svg inside an interactive cell control', () => {
    const { container } = render(<WideGridWithSvgButton />)

    const grid = screen.getByRole('grid', { name: 'Registros largos com ação' })
    defineHorizontalOverflow(grid)
    const pointerCapture = definePointerCapture(grid)
    const icon = container.querySelector<SVGElement>('[data-testid="row-action-icon"]')
    if (!icon) throw new Error('Expected row action icon')
    grid.scrollLeft = 160

    fireEvent.pointerDown(icon, {
      button: 0,
      clientX: 220,
      clientY: 40,
      pointerId: 14,
      pointerType: 'mouse',
    })
    fireEvent.pointerMove(grid, {
      button: 0,
      buttons: 1,
      clientX: 140,
      clientY: 40,
      pointerId: 14,
      pointerType: 'mouse',
    })
    fireEvent.pointerUp(grid, { pointerId: 14, pointerType: 'mouse' })
    fireEvent.click(screen.getByRole('button', { name: 'Abrir Alpha' }))

    expect(grid.scrollLeft).toBe(160)
    expect(pointerCapture.setPointerCapture).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Cliques').textContent).toBe('1')
  })
})
