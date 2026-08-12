You are integrating a read-only collection with `@tc96/datagrid`.

Render `DataGrid` without providing `onRowAdd`. Compose only toolbar controls that serve a real purpose in the interface, and keep columns and data under the consumer's ownership.

Do not render a disabled add button or an action without an implementation. Preserve sorting, filtering, keyboard navigation, and the other capabilities configured through `useDataGrid`.
