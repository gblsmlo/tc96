'use client'

import type { Table as TanstackTable } from '@tanstack/react-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import type React from 'react'
import { Button } from '../components/button'
import { Pagination, PaginationContent, PaginationItem } from '../components/pagination'
import { cn } from '../lib/utils'

export interface DataGridPaginationProps<TData>
  extends Omit<React.ComponentProps<'div'>, 'children'> {
  table: TanstackTable<TData>
}

/** Pagination footer for either client-side or manually controlled TanStack tables. */
export function DataGridPagination<TData>({
  className,
  table,
  ...props
}: DataGridPaginationProps<TData>): React.ReactElement {
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()
  const totalRows = table.getRowCount()
  const first = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const last = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div
      className={cn('flex flex-wrap items-center justify-between gap-2 p-2', className)}
      data-slot="data-grid-pagination"
      {...props}
    >
      <p className="px-2 text-muted-foreground text-sm tabular-nums" aria-live="polite">
        {first}–{last} de {totalRows}
      </p>
      <Pagination aria-label="Paginação da tabela" className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              aria-label="Primeira página"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
              size="icon-sm"
              variant="outline"
            >
              <ChevronsLeftIcon />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              aria-label="Página anterior"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="icon-sm"
              variant="outline"
            >
              <ChevronLeftIcon />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 text-muted-foreground text-sm tabular-nums">
              {pageIndex + 1} / {Math.max(pageCount, 1)}
            </span>
          </PaginationItem>
          <PaginationItem>
            <Button
              aria-label="Próxima página"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="icon-sm"
              variant="outline"
            >
              <ChevronRightIcon />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              aria-label="Última página"
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(Math.max(pageCount - 1, 0))}
              size="icon-sm"
              variant="outline"
            >
              <ChevronsRightIcon />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
