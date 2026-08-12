# TC96

[![License: MIT](https://img.shields.io/badge/license-MIT-18181b.svg)](./packages/tc96/LICENSE)
[![Bun](https://img.shields.io/badge/runtime-Bun-f9f1e1.svg)](https://bun.sh)
[![Status](https://img.shields.io/badge/status-0.1.0%20release%20candidate-d97706.svg)](./docs/plan/roadmap.md)

Uma base React para levar componentes, composições e blocos reutilizáveis entre
projetos sem carregar decisões de produto que não pertencem à interface.

TC96 nasceu da necessidade de organizar e adaptar componentes shadcn/COSS para
um conjunto consistente de preferências: React, Tailwind CSS, TypeScript, Biome
e Bun. O nome referencia o motor **Twin Cam 96** da Harley-Davidson — uma base
confiável sobre a qual diferentes projetos podem ser construídos.

> **Estado da publicação:** a versão `0.1.0` está pronta como release candidate,
> mas ainda não foi publicada no npm. O identificador não escopado `tc96` foi
> recusado pelo registry por similaridade com um pacote existente; o namespace
> npm definitivo está em definição. Os exemplos abaixo representam o contrato
> público planejado.

## Por que TC96?

- **Uma API, duas formas de adoção:** importar o pacote ou instalar código-fonte
  autocontido pelo registry COSS.
- **Camadas explícitas:** primitives, composições, blocos e utilitários não ficam
  misturados em um export genérico.
- **Sem domínio embutido:** permissões, persistência, mutações, busca remota e
  vocabulário de produto continuam sob responsabilidade do consumidor.
- **Padrões consistentes:** tamanhos, estados e comportamento compartilhados
  evoluem em um único lugar.
- **Qualidade como contrato:** exports, registry, tipos, interações e builds são
  validados juntos antes de uma release.

## API pública

TC96 segue uma taxonomia inspirada no shadcn/ui e não oferece um import raiz.
Cada dependência deixa clara a camada que está sendo consumida. Enquanto o nome
npm definitivo não é publicado, `tc96` representa abaixo o identificador lógico
do pacote — estes imports ainda não devem ser copiados para produção.

| Camada | Import | Responsabilidade |
| --- | --- | --- |
| `ui` | `tc96/ui` | Primitives visuais como `Button`, `Input`, `Text` e `Spinner` |
| `components` | `tc96/components` | Composições reutilizáveis como Properties e Editable |
| `blocks` | `tc96/blocks` | Seções completas como Kanban, List, DataGrid, Detail Sheet e Filter Builder |
| `utils` | `tc96/utils` | Utilitários sem React ou semântica de produto, como `cn` |

```tsx
import { Kanban } from 'tc96/blocks'
import { SelectProperty } from 'tc96/components'
import { Button, Input, Text } from 'tc96/ui'
import { cn } from 'tc96/utils'
```

Essa divisão também protege a direção das dependências:

```text
blocks ────────> components ────────> ui
   │                   │               │
   └───────────────────┴──────────────> utils
```

## Formas de distribuição

### Pacote

O pacote entrega módulos ESM tipados por subpath. O consumidor instala uma
versão única e importa apenas a camada necessária. A instrução de instalação
será adicionada quando o identificador npm definitivo for publicado.

### Registry COSS

[coss ui](https://coss.com/ui/docs/get-started) é uma biblioteca construída
sobre Base UI e Tailwind CSS cujo modelo permite adicionar componentes pelo CLI
do shadcn ou copiar o código para o próprio projeto. O registry do TC96 estende
esse modelo para suas composições e blocos: instala o código-fonte do grupo
escolhido e resolve arquivos compartilhados de forma transitiva para manter cada
entrada autocontida.

As entradas atuais cobrem:

- collection views, incluindo Kanban e List;
- Properties;
- DataGrid;
- Detail Sheet;
- Editable;
- Filter Builder.

O consumidor passa a possuir o código instalado e pode adaptá-lo sem trazer os
demais blocos para o projeto.

O registry do TC96 ainda não possui uma URL pública. As entradas são geradas em
`packages/tc96/registry/generated` durante o build e serão distribuídas junto do
pacote. Dentro deste repositório, o fluxo completo pode ser validado com:

```sh
bun --cwd=packages/tc96 run test:consumer
```

## Requisitos do consumidor

| Dependência | Versão |
| --- | --- |
| React e React DOM | `>=19.1.1 <20` |
| Tailwind CSS | `>=4.2.2 <5` |
| Base UI | `>=1.6.0 <2` |

O pacote é ESM, inclui declarações TypeScript e pressupõe que o consumidor
configure os tokens do Tailwind/COSS em seu CSS global. A referência atual de
tokens e estilos está na documentação do
[coss ui](https://coss.com/ui/docs/get-started#styling).

## Desenvolvimento local

Para contribuir, use Node.js 22 ou superior e Bun `1.3.14`. Biome, Storybook,
Vitest Browser, Playwright, Vite e Fumadocs são ferramentas internas do
workspace, não dependências exigidas da aplicação consumidora.

```sh
git clone https://github.com/gblsmlo/tc96.git
cd tc96
bun install
bun run check
```

Quem já usa SSH pode clonar com `git@github.com:gblsmlo/tc96.git`.

Aplicações internas:

```sh
bun run storybook      # catálogo visual em localhost:6006
bun run docs:dev       # documentação Fumadocs
```

Validação completa de release:

```sh
bun run release:check
```

Esse gate executa Biome, TypeScript, testes Bun, testes Storybook no Chromium,
build do pacote, verificação da API pública, build da documentação e inspeção
do tarball npm. A checklist que define a release candidate está no
[roadmap](./docs/plan/roadmap.md).

## Estrutura do repositório

```text
apps/
  docs/          documentação Fumadocs
  storybook/     catálogo visual e testes de interação
packages/
  tc96/
    src/features/ implementação organizada por feature
    src/shared/   primitives e utilitários compartilhados
    src/{ui,components,blocks,utils}/ fachadas da API pública
docs/
  architecture/ decisões arquiteturais
  plan/          roadmap e migração incremental
```

O monorepo mantém ferramentas e aplicações consumidoras próximas do pacote,
mas existe apenas uma unidade de versionamento. Stories e documentação devem
consumir exclusivamente os subpaths públicos para funcionarem como testes reais
de integração.

## Princípios para contribuição

1. Preserve as features como unidades de implementação e as camadas públicas
   como fachadas de exportação.
2. Não introduza regras de negócio ou vocabulário específico de um produto.
3. Atualize implementação, tipos, testes, stories, documentação e registry no
   mesmo conjunto de mudanças.
4. Garanta que toda entrada COSS continue autocontida.
5. Execute `bun run release:check` antes de propor uma release.

Antes de mover código entre features, consulte a
[estrutura feature-based](./docs/plan/structural-migration.md) e as
[decisões arquiteturais](./docs/architecture/adr-003-feature-based-source-boundaries.md).

## Licença

TC96 é distribuído sob a [licença MIT](./packages/tc96/LICENSE).
