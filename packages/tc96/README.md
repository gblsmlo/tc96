# tc96

`tc96` is a domain-neutral React framework for applications that use Tailwind CSS,
COSS, Base UI, Biome, and TypeScript. Its public API follows the shadcn taxonomy.

```tsx
import { Button, Input } from 'tc96/ui'
import { SelectProperty } from 'tc96/components'
import { Kanban } from 'tc96/blocks'
import { cn } from 'tc96/utils'
```

`ui` contains primitives, `components` contains reusable compositions, `blocks`
contains complete application sections, and `utils` contains framework-agnostic helpers.

See the validated [`StatusPill` example](./examples/utils/status-pill.tsx) for a
small composition using `cn` from `tc96/utils`.

See the documentation app for installation and COSS registry guidance.

For COSS source installation, add the one group you own:

```sh
bunx shadcn@latest add ./node_modules/tc96/registry/generated/view.json
```
