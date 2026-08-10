# DataGrid

DataGrid is a domain-neutral collection pattern for product interfaces that need
to display, scan, filter, select, and act on structured records. It provides the
view layer and interaction primitives. The consuming application provides the
business model, server state, permissions, navigation, and mutations.

Use this pattern when the user is working with a collection rather than reading a
single object. Good fits include operational lists, admin records, issue queues,
approval tables, billing rows, customer records, and other SaaS surfaces where
users need to compare multiple items quickly.

## Contract

The package owns the grid experience:

- WAI-ARIA grid semantics and keyboard navigation
- sorting, filtering, resizing, visibility, selection, and pagination controls
- stable row identity through TanStack Table
- optional row creation and single-select cell editing primitives
- loading, empty, overflow, pinned-column, and virtualized states
- threshold-based horizontal drag scrolling for wide grids
- toolbar primitives that compose without product-specific assumptions

The consumer owns product behavior:

- domain column definitions, labels, icons, and copy
- data fetching, errors, optimistic updates, and persistence
- authorization, permission checks, and available actions
- routing, detail views, side panels, and navigation
- business transitions and validation rules
- telemetry and product analytics

The DataGrid should not infer a workflow from data shape. A selected row does not
imply which action is valid, a status column does not imply which transitions are
allowed, and a toolbar button does not carry permission logic by itself.

## Basic Composition

Build the table state with `useDataGrid`, then compose the toolbar and grid with
the pieces your product needs.

```tsx
const { table } = useDataGrid({
  columns,
  data,
  getRowId: (row) => row.id,
})

return (
  <>
    <DataGridToolbar>
      <DataGridSearch table={table} />
      <DataGridFilterMenu table={table} />
      <DataGridDensityMenu table={table} />
      <DataGridViewOptions table={table} />
    </DataGridToolbar>
    <DataGrid aria-label="Records" table={table} />
    <DataGridPagination table={table} />
  </>
)
```

Use stable row IDs from domain data. Avoid index-based IDs because selection,
pinning, virtualization, and row updates need identity to survive sorting,
filtering, pagination, and remote refreshes.

## Columns

Columns should describe the meaning of the data, not only its visual shape. Use
`meta.label` for readable labels and `meta.type` to communicate the semantic role
of the column. The package can render common primitives, but the consumer remains
responsible for choosing a domain-accurate column model.

Recommended column intent:

- `title` for the primary object name or record label
- `status` for lifecycle or processing state
- `priority` for urgency or rank
- `date` for timestamps and deadlines
- `number` for counts, amounts, and metrics
- `text` for secondary descriptive values
- `actions` for row-level commands owned by the consumer

Size columns to their expected content. A table with narrow content should hug
its content and only use horizontal drag scroll when the rendered columns exceed
the wrapper.

## Selection And Actions

Selection is for user action, not decoration. Add selection only when the page
offers a real bulk operation or contextual command. When rows are selected, show
a short selection summary and place the action label next to the action button so
the user can understand what will happen before applying it.

The first selection column is centered in the header and body. Fixed positioning
is opt-in through user interaction or explicit props; it should not become sticky
only because the grid has checkboxes.

## Density

DataGrid supports three row densities:

- compact for dense operational scanning
- medium for balanced default lists
- tall for comfortable rows with richer cells

Choose density from the task. High-frequency operational views usually benefit
from compact or medium density. Review-oriented screens can use tall rows when
the extra space improves recognition.

## Overflow And Pinning

Horizontal drag scroll is enabled only when the rendered columns are wider than
the wrapper. It starts after an 8px pointer movement threshold and ignores
interactive elements, column headers, resize handles, editable controls, and row
actions.

Pinned columns keep context visible during horizontal navigation. They must use
the same selected and hover backgrounds as non-pinned cells so a row still reads
as one continuous row. When the viewport cannot safely fit both pinned sides, the
right pinned side is visually suppressed until there is enough room again.

## Loading And Empty States

Use the loading state while records are being fetched or refreshed. Preserve the
same column structure during loading so the surface does not jump. Use the empty
state when the fetch succeeded but no records match the current data or filters.

Empty state copy belongs to the consumer because it depends on the user's task,
filters, permissions, and product vocabulary.

## Storybook Cases

Each Storybook entry documents one pattern:

- Functionality Overview: complete collection composition with selection,
  toolbar controls, pagination, row creation, and contextual actions
- Column Types: semantic column metadata and default column presentation
- Single Select Cells: controlled editable cells owned by the consumer
- Without Add Row: read-only collection surface without the add-row affordance
- Virtualized Overflow: sticky header, constrained height, and virtualized rows
- Wide Drag Scroll: horizontal overflow, drag scrolling, and pinned edges
- Medium Density: balanced row density for default collection screens
- Loading: standard loading structure
- Pinned Loading: loading state with explicit pinned columns
- Empty: successful empty collection state
