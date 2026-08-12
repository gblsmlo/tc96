# ADR-002: Monorepo com uma unidade de publicação

## Status

Aceito.

## Contexto

TC96 precisa manter o pacote React, documentação Fumadocs, Storybook, testes e
geração do registry COSS no mesmo repositório. Separar cada camada em um pacote
npm recuperaria o custo de versionamento e integração que motivou a consolidação.

O registry possui uma restrição adicional: o código instalado no projeto do
consumidor deve permanecer autocontido. Um import interno válido no pacote npm
não pode ser copiado pelo registry sem que sua dependência também seja incluída.

## Opções consideradas

| Opção | Vantagens | Custos |
| --- | --- | --- |
| Repositório e pacote únicos | Operação simples | Docs e ferramentas ficam misturadas ao pacote |
| Monorepo com pacote por camada | Releases independentes | Mais versões, dependências e coordenação |
| Monorepo com um pacote público | Apps isolados e uma release | Requer limites e testes estruturais |

## Decisão

Usar workspaces Bun com:

- `apps/*` para consumidores e ferramentas que não são publicados;
- `packages/tc96` como única unidade npm pública;
- `tc96/ui`, `tc96/components`, `tc96/blocks` e `tc96/utils` como subpaths, não
  como pacotes independentes;
- testes unitários próximos dos fontes e Playwright na raiz apenas para fluxos
  completos de navegador;
- registry COSS gerado e validado como um segundo formato de distribuição.

## Regras de dependência

```text
blocks ────────> components ────────> ui
   │                   │               │
   └───────────────────┴──────────────> utils
```

- `ui` não importa `components` nem `blocks`;
- `components` não importa `blocks`;
- `utils` não importa React ou qualquer camada visual;
- `apps` consomem apenas os exports públicos de `tc96`;
- código copiado pelo registry declara todos os arquivos e dependências de que
  precisa.

## Trade-offs aceitos

- O pipeline do repositório valida mais de uma aplicação.
- Uma alteração pode bloquear a release única do pacote.
- Adapters COSS locais a uma feature podem duplicar primitives compartilhadas
  quando isso for necessário para manter o payload autocontido.

Esses custos são mitigados por testes de fronteira, features coesas e builds
separados por workspace.

## Gatilhos para reconsiderar

Uma camada só deve virar pacote independente quando possuir, ao mesmo tempo,
ciclo de release próprio, consumidores próprios e dependências ou responsáveis
claramente diferentes do restante do TC96.
