# tc96

`tc96` is a domain-neutral React framework for applications that use Tailwind CSS,
COSS, Base UI, Biome, and TypeScript. It publishes deliberate subpaths so an app
only imports the feature family it needs.

```tsx
import { KanbanView } from 'tc96/view'
import { SelectProperty } from 'tc96/properties'
```

The first migration ports the existing view, properties, DataGrid, detail sheet,
editable, and filter-builder groups without making product decisions for consumers.

See the documentation app for installation and COSS registry guidance.

For COSS source installation, add the one group you own:

```sh
bunx shadcn@latest add ./node_modules/tc96/registry/generated/view.json
```
