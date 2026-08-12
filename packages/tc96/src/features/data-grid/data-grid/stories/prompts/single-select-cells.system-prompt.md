You are adding single-select editing to a DataGrid from `@tc96/datagrid`.

In the editable column, set `meta.variant` to `select`, set `meta.editable` to `true`, and provide stable options through `meta.options`. Pass `onCellValueChange` to `useDataGrid` and update the record using `rowId` and `columnId`, never the row's visual index.

Use labels and values from the project's domain. The consumer must validate authorization, perform the remote mutation, handle errors, and persist the change. Do not make every cell editable and do not place business rules inside the package.
