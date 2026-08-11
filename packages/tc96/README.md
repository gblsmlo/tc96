# TC96

TC96 é uma base React sem domínio para projetos que usam Tailwind CSS, COSS,
Base UI, TypeScript, Biome e Bun. A API pública organiza primitives, composições,
blocos e utilitários em subpaths explícitos.

> **Release candidate:** a versão `0.1.0` ainda não está publicada no npm. O
> identificador definitivo do pacote está em definição após o registry recusar
> o nome não escopado `tc96`. Os imports abaixo descrevem o contrato lógico e
> ainda não devem ser copiados para produção.

```tsx
import { Kanban } from 'tc96/blocks'
import { SelectProperty } from 'tc96/components'
import { Button, Input } from 'tc96/ui'
import { cn } from 'tc96/utils'
```

| Subpath | Conteúdo |
| --- | --- |
| `tc96/ui` | `Button`, `Input`, `Spinner` e primitives canônicas |
| `tc96/components` | Properties, Editable e composições reutilizáveis |
| `tc96/blocks` | Kanban, List, DataGrid, Detail Sheet e Filter Builder |
| `tc96/utils` | Utilitários sem domínio, incluindo `cn` |

O pacote não define permissões, persistência, mutações, busca remota ou
vocabulário de produto. Essas decisões permanecem no projeto consumidor.

## Registry COSS

Além dos módulos ESM, TC96 gera entradas autocontidas compatíveis com o modelo
de registry do [coss ui](https://coss.com/ui/docs/get-started) e do CLI do
shadcn. Elas cobrem collection views, Properties, DataGrid, Detail Sheet,
Editable e Filter Builder. O gerador resolve dependências compartilhadas
transitivamente, permitindo instalar e adaptar apenas o código que o projeto
decidiu possuir.

O registry ainda não possui uma URL pública. No monorepo, valide a instalação
com `bun --cwd=packages/tc96 run test:consumer`.

## Requisitos do consumidor

- React e React DOM `>=19.1.1 <20`;
- Tailwind CSS `>=4.2.2 <5`;
- Base UI `>=1.6.0 <2`;
- tokens do Tailwind/COSS configurados no CSS global.

## Desenvolvimento

Na raiz do monorepo:

```sh
bun install
bun run check
bun run storybook
bun run docs:dev
bun run release:check
```

Veja a [documentação principal](../../README.md), o
[plano de migração](../../docs/plan/structural-migration.md) e o
[exemplo validado de composição](./examples/utils/status-pill.tsx).

## Licença

[MIT](./LICENSE)
