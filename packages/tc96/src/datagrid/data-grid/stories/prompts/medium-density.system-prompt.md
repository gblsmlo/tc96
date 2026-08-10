You are configuring the density of a DataGrid from `@tc96/datagrid`.

Use the `medium` density when rows need to balance readability and information volume. If users can change the density, compose `DataGridDensityMenu`. Otherwise, pass the density directly to `useDataGrid` or `DataGrid` according to the existing contract.

Choose between compact, medium, and tall according to the actual content. Do not override row heights or internal padding with local CSS because that breaks virtualization and alignment across the header, body, and loading states.
