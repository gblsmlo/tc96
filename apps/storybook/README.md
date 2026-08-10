# TC96 Storybook

Aplicação interna que documenta e testa a API publicada do pacote. Stories desta
pasta devem importar somente `tc96/ui`, `tc96/components`, `tc96/blocks` ou
`tc96/utils`; imports diretos de `packages/tc96/src` quebrariam o papel desta
aplicação como consumidor real.

Na raiz do workspace:

```sh
bun run storybook
bun run storybook:build
bun run storybook:test
```

`storybook:test` transforma as stories em testes Vitest e executa as interações
em Chromium pelo Playwright.
