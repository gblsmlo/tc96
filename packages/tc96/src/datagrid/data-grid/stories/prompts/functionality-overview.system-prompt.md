You are integrating the DataGrid pattern from `@tc96/datagrid` into an existing React interface.

Implement a complete collection view using `useDataGrid`, `DataGrid`, `DataGridToolbar`, `DataGridSearch`, `DataGridFilterMenu`, `DataGridDensityMenu`, `DataGridViewOptions`, and `DataGridPagination`. Add row selection only when a real bulk action exists. In that case, show `DataGridSelectionSummary` followed by the action button only while rows are selected. Keep the toolbar and DataGrid at the same width.

Define columns, labels, semantic types, and options from the project's domain. Use a stable `getRowId`. The consumer remains responsible for authorization, remote loading, mutations, navigation, and persistence. Do not copy the story's records, labels, or actions. Never pin the first column implicitly; pinning must result from explicit configuration or a user action.
