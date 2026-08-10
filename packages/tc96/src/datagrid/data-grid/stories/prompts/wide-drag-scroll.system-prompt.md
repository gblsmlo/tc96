You are integrating a DataGrid with more columns than its wrapper can contain using `@tc96/datagrid`.

Define appropriate column sizes and let DataGrid enable horizontal overflow only when the total column width exceeds the viewport. Configure `columnPinning` explicitly only for columns that must remain visible as navigation references. Ensure that the combined widths pinned to the left and right do not occupy the entire viewport.

Keep interactive controls, headers, and resize handles outside the drag-scroll gesture. Do not force `width: 100%` when the content is narrower than the wrapper, and do not pin the first column automatically.
