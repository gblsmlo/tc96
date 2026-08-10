You are implementing loading in a DataGrid with explicitly pinned columns using `@tc96/datagrid`.

Provide the same `columnPinning` used by the loaded state and render `DataGrid` with `isLoading`. Preserve column sizes so sticky offsets, dividers, and skeletons remain aligned. In narrow wrappers, allow the right pinned column to degrade responsively to prevent overlap with the area pinned to the left.

Do not apply `position: sticky`, offsets, or shadows manually to skeletons. DataGrid must share its pinning calculation across the header, loading state, and body.
