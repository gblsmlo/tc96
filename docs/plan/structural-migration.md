# Migração estrutural feature-based

## Estado

Concluída.

## Objetivo

Organizar a implementação pela unidade que muda em conjunto, sem transformar as
camadas públicas em pastas horizontais de implementação. `ui`, `components`,
`blocks` e `utils` continuam sendo o contrato do pacote; features e módulos
compartilhados passam a ser a fonte canônica.

## Estrutura canônica

```text
packages/tc96/src/
  features/
    collection-views/
    data-grid/
    detail-sheet/
    editable/
    filter-builder/
    properties/
  shared/
    ui/
    utils/
  blocks/index.ts
  components/index.ts
  ui/index.ts
  utils/index.ts
```

`collection`, `kanban` e `list` pertencem à feature `collection-views`. O outlet
de collection compõe Kanban e List, enquanto List reutiliza os tipos e a projeção
de Collection; separá-los em features independentes criaria dependências
circulares artificiais.

## Contrato público

| Fonte | Fachada | Subpath |
| --- | --- | --- |
| `shared/ui` | `src/ui/index.ts` | `tc96/ui` |
| `shared/utils` | `src/utils/index.ts` | `tc96/utils` |
| `features/properties` e `features/editable` | `src/components/index.ts` | `tc96/components` |
| demais features | `src/blocks/index.ts` | `tc96/blocks` |

As fachadas apenas reexportam. Features não importam essas fachadas, evitando
ciclos entre implementação e API pública.

## Registry COSS

Os nomes `view`, `properties`, `datagrid`, `detail-sheet`, `editable` e
`filter-builder` foram preservados como chaves de compatibilidade do registry.
O gerador resolve cada chave para sua fonte em `src/features` e continua
produzindo payloads autocontidos.

## Guardas

- cada feature possui seu próprio `tsconfig.json` e saída interna;
- não existem fontes nos antigos diretórios horizontais;
- as quatro fachadas públicas são verificadas por teste arquitetural;
- os seis payloads COSS resolvem imports locais de forma transitiva;
- Storybook e Fumadocs consomem somente os subpaths públicos;
- o teste de consumidor instala o tarball e os seis itens do registry em um
  projeto Vite temporário.
