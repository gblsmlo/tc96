You are implementing the empty state of a collection with `@tc96/datagrid`.

When the query completes without records, render `DataGrid` with a short, specific `emptyMessage` that fits the context. Distinguish a truly empty collection from an empty result caused by filters. Offer a clear-filters action outside the message when applicable.

The consumer decides whether to offer a creation action and provides `onRowAdd` only when that action is authorized and functional. Do not represent loading or error conditions as an empty state.
