You are implementing the loading state of a collection with `@tc96/datagrid`.

While the initial data is pending, render `DataGrid` with `isLoading` and choose `loadingRowCount` according to the available space. Keep the same column definitions, sizes, and order used by the loaded state to avoid abrupt layout shifts.

The consumer controls the request, error handling, retry behavior, and transition to real data. Do not use the empty state while the initial load is still in progress.
