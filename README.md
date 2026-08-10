# TC96 workspace

Monorepo de desenvolvimento do TC96. O workspace mantém documentação, catálogo
visual, testes e ferramentas próximos do código, mas publica uma única unidade
npm: [`tc96`](./packages/tc96).

## Estrutura

```text
apps/
  docs/         documentação Fumadocs
  storybook/    catálogo visual (próxima etapa)
packages/
  tc96/         único pacote npm público
docs/
  architecture/ decisões arquiteturais
  plan/         plano incremental de desenvolvimento
tests/
  e2e/          fluxos Playwright (quando necessários)
```

As camadas públicas do pacote são `tc96/ui`, `tc96/components`, `tc96/blocks` e
`tc96/utils`. Os grupos históricos permanecem internos durante a migração e
continuam gerando entradas autocontidas para o registry COSS.

## Desenvolvimento

```sh
bun install
bun run check
bun run docs:dev
bun run release:check
```

Consulte o [plano estrutural](./docs/plan/structural-migration.md) antes de mover
componentes entre camadas.
