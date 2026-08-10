'use client'

import type { Table as TanstackTable } from '@tanstack/react-table'
import {
  AlignVerticalSpaceAroundIcon,
  ArrowDownUpIcon,
  Columns3Icon,
  EqualIcon,
  ListFilterIcon,
  MinusIcon,
} from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../components/button'
import { Input } from '../components/input'
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '../components/menu'
import { Popover, PopoverPopup, PopoverTrigger } from '../components/popover'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../components/toolbar'
import { cn } from '../lib/utils'
import type { DataGridColumnMeta, DataGridDensity } from './types'

export interface DataGridToolbarProps extends React.ComponentProps<typeof Toolbar> {}

/**
 * Composable action surface for a data grid. The grid never decides which
 * actions belong here: search, filters, view controls and domain commands are
 * supplied by the consumer.
 */
export function DataGridToolbar({
  'aria-label': ariaLabel = 'Ações da tabela',
  className,
  ...props
}: DataGridToolbarProps): React.ReactElement {
  return (
    <Toolbar
      aria-label={ariaLabel}
      className={cn('mb-3 flex-wrap', className)}
      data-slot="data-grid-toolbar"
      variant="plain"
      {...props}
    />
  )
}

export interface DataGridFilterMenuProps<TData> {
  className?: string
  label?: string
  table: TanstackTable<TData>
}

/** Column filter controls derived from filterable TanStack columns. */
export function DataGridFilterMenu<TData>({
  className,
  label = 'Filtrar',
  table,
}: DataGridFilterMenuProps<TData>): React.ReactElement | null {
  const columns = table.getAllLeafColumns().filter((column) => column.getCanFilter())
  if (columns.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger
        render={<Button aria-label={label} className={className} size="sm" variant="outline" />}
      >
        <ListFilterIcon />
        {label}
      </PopoverTrigger>
      <PopoverPopup align="end" className="w-72">
        <div className="flex flex-col gap-3" data-slot="data-grid-filter-menu">
          <div>
            <h3 className="font-medium text-sm">Filtrar por</h3>
            <p className="text-muted-foreground text-xs">Preencha um ou mais campos.</p>
          </div>
          {columns.map((column) => {
            const meta = (column.columnDef.meta ?? {}) as DataGridColumnMeta
            const columnLabel = meta.label ?? column.id
            const inputId = `data-grid-filter-${column.id}`
            return (
              <label className="grid gap-1.5 text-sm" htmlFor={inputId} key={column.id}>
                <span className="font-medium">{columnLabel}</span>
                <Input
                  aria-label={`Filtrar ${columnLabel}`}
                  id={inputId}
                  onChange={(event) => {
                    const value = event.target.value
                    column.setFilterValue(value || undefined)
                    table.setPageIndex(0)
                  }}
                  placeholder={`Buscar em ${columnLabel.toLocaleLowerCase('pt-BR')}…`}
                  value={String(column.getFilterValue() ?? '')}
                />
              </label>
            )
          })}
          {table.getState().columnFilters.length > 0 ? (
            <Button onClick={() => table.resetColumnFilters()} size="sm" variant="ghost">
              Limpar filtros
            </Button>
          ) : null}
        </div>
      </PopoverPopup>
    </Popover>
  )
}

export interface DataGridSortMenuProps<TData> {
  className?: string
  label?: string
  table: TanstackTable<TData>
}

/** Multi-column sort surface. Sorting state remains owned by TanStack Table. */
export function DataGridSortMenu<TData>({
  className,
  label = 'Ordenar',
  table,
}: DataGridSortMenuProps<TData>): React.ReactElement | null {
  const columns = table.getAllLeafColumns().filter((column) => column.getCanSort())
  if (columns.length === 0) return null

  return (
    <Menu>
      <MenuTrigger
        render={<Button aria-label={label} className={className} size="sm" variant="outline" />}
      >
        <ArrowDownUpIcon />
        {label}
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuGroup>
          <MenuGroupLabel>Ordenar por</MenuGroupLabel>
          {columns.flatMap((column) => {
            const meta = (column.columnDef.meta ?? {}) as DataGridColumnMeta
            const columnLabel = meta.label ?? column.id
            return [
              <MenuItem key={`${column.id}-asc`} onClick={() => column.toggleSorting(false)}>
                {columnLabel}: crescente
              </MenuItem>,
              <MenuItem key={`${column.id}-desc`} onClick={() => column.toggleSorting(true)}>
                {columnLabel}: decrescente
              </MenuItem>,
            ]
          })}
        </MenuGroup>
        {table.getState().sorting.length > 0 ? (
          <>
            <MenuSeparator />
            <MenuItem onClick={() => table.resetSorting()}>Limpar ordenação</MenuItem>
          </>
        ) : null}
      </MenuPopup>
    </Menu>
  )
}

const DENSITIES: Array<{
  icon: React.ComponentType<React.ComponentProps<'svg'>>
  label: string
  value: DataGridDensity
}> = [
  { icon: MinusIcon, label: 'Compacta', value: 'short' },
  { icon: EqualIcon, label: 'Média', value: 'medium' },
  { icon: AlignVerticalSpaceAroundIcon, label: 'Alta', value: 'tall' },
]

export interface DataGridDensityMenuProps<TData> {
  className?: string
  table: TanstackTable<TData>
}

/** Controlled density menu backed by the grid metadata installed by `useDataGrid`. */
export function DataGridDensityMenu<TData>({
  className,
  table,
}: DataGridDensityMenuProps<TData>): React.ReactElement {
  const density = table.options.meta?.dataGridDensity ?? 'short'
  const selected = DENSITIES.find((option) => option.value === density) ?? DENSITIES[0]!
  const SelectedIcon = selected.icon

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button aria-label={selected.label} className={className} size="sm" variant="outline" />
        }
      >
        <SelectedIcon />
        {selected.label}
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuRadioGroup
          onValueChange={(value) =>
            table.options.meta?.onDataGridDensityChange?.(value as DataGridDensity)
          }
          value={density}
        >
          <MenuGroupLabel>Altura das linhas</MenuGroupLabel>
          {DENSITIES.map((option) => (
            <MenuRadioItem key={option.value} value={option.value}>
              <span className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex-1 truncate">{option.label}</span>
                <option.icon className="text-muted-foreground" />
              </span>
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  )
}

export function DataGridToolbarGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarGroup>): React.ReactElement {
  return (
    <ToolbarGroup
      className={cn('flex-wrap', className)}
      data-slot="data-grid-toolbar-group"
      {...props}
    />
  )
}

export function DataGridToolbarSeparator(
  props: React.ComponentProps<typeof ToolbarSeparator>,
): React.ReactElement {
  return <ToolbarSeparator data-slot="data-grid-toolbar-separator" {...props} />
}

export interface DataGridSearchProps<TData>
  extends Omit<
    React.ComponentProps<typeof Input>,
    'onBlur' | 'onChange' | 'onKeyDown' | 'type' | 'value'
  > {
  commitOnBlur?: boolean
  commitOnEnter?: boolean
  debounceMs?: number
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  table: TanstackTable<TData>
}

/** Client-side global search control. Server-controlled consumers can render their own input. */
export function DataGridSearch<TData>({
  'aria-label': ariaLabel,
  className,
  commitOnBlur = true,
  commitOnEnter = true,
  debounceMs = 250,
  onBlur,
  onKeyDown,
  placeholder = 'Buscar…',
  table,
  ...props
}: DataGridSearchProps<TData>): React.ReactElement {
  const accessibleName = ariaLabel ?? placeholder
  const globalFilter = (table.getState().globalFilter as string) ?? ''
  const [inputValue, setInputValue] = useState(globalFilter)
  const pendingValueRef = useRef(globalFilter)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearPendingCommit = useCallback(() => {
    if (timerRef.current === null) return
    clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  const commitSearchValue = useCallback(
    (value: string) => {
      clearPendingCommit()
      pendingValueRef.current = value
      if (value === ((table.getState().globalFilter as string) ?? '')) return
      table.setGlobalFilter(value)
      table.setPageIndex(0)
    },
    [clearPendingCommit, table],
  )

  const queueSearchValue = useCallback(
    (value: string) => {
      pendingValueRef.current = value
      clearPendingCommit()
      if (debounceMs <= 0) {
        commitSearchValue(value)
        return
      }
      timerRef.current = setTimeout(() => commitSearchValue(value), debounceMs)
    },
    [clearPendingCommit, commitSearchValue, debounceMs],
  )

  useEffect(() => {
    setInputValue(globalFilter)
    pendingValueRef.current = globalFilter
  }, [globalFilter])

  useEffect(() => clearPendingCommit, [clearPendingCommit])

  return (
    <Input
      aria-label={accessibleName}
      className={cn('max-w-64', className)}
      data-slot="data-grid-search"
      onBlur={(event) => {
        if (commitOnBlur) commitSearchValue(pendingValueRef.current)
        onBlur?.(event)
      }}
      onChange={(event) => {
        const nextValue = event.target.value
        setInputValue(nextValue)
        queueSearchValue(nextValue)
      }}
      onKeyDown={(event) => {
        if (commitOnEnter && event.key === 'Enter') commitSearchValue(pendingValueRef.current)
        onKeyDown?.(event)
      }}
      placeholder={placeholder}
      type="search"
      value={inputValue}
      {...props}
    />
  )
}

export interface DataGridViewOptionsProps<TData> {
  className?: string
  label?: string
  table: TanstackTable<TData>
}

/** Column visibility menu. Column labels come from `columnDef.meta.label`. */
export function DataGridViewOptions<TData>({
  className,
  label = 'Colunas',
  table,
}: DataGridViewOptionsProps<TData>): React.ReactElement | null {
  const columns = table.getAllLeafColumns().filter((column) => column.getCanHide())
  if (columns.length === 0) return null

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button className={className} size="sm" variant="outline">
            <Columns3Icon />
            {label}
          </Button>
        }
      />
      <MenuPopup align="end">
        {columns.map((column) => {
          const meta = (column.columnDef.meta ?? {}) as DataGridColumnMeta
          return (
            <MenuCheckboxItem
              checked={column.getIsVisible()}
              closeOnClick={false}
              key={column.id}
              onCheckedChange={(checked) => column.toggleVisibility(Boolean(checked))}
            >
              {meta.label ?? column.id}
            </MenuCheckboxItem>
          )
        })}
      </MenuPopup>
    </Menu>
  )
}

export interface DataGridSelectionSummaryProps<TData>
  extends Omit<React.ComponentProps<'span'>, 'children'> {
  table: TanstackTable<TData>
}

/** Live selection summary intended for contextual row-action toolbars. */
export function DataGridSelectionSummary<TData>({
  className,
  table,
  ...props
}: DataGridSelectionSummaryProps<TData>): React.ReactElement {
  const count = table.getSelectedRowModel().rows.length
  return (
    <span
      aria-live="polite"
      className={cn('px-2 text-muted-foreground text-sm tabular-nums', className)}
      data-slot="data-grid-selection-summary"
      {...props}
    >
      {count} {count === 1 ? 'selecionado' : 'selecionados'}
    </span>
  )
}
