You are integrating a large collection with `@tc96/datagrid`.

Enable `virtualize` on `DataGrid`, define a `maxHeight` appropriate for the layout, and provide a stable `getRowId`. Avoid simultaneous local pagination when the intended experience is a continuous virtualized collection. Preserve the sticky header, selection, keyboard focus, and loading and empty states.

The consumer must fetch remote pages or windows, control caching, and handle incremental loading. Do not use virtualization for small collections and do not derive identity from the rendered index.
