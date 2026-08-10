# Plano de migração estrutural

## Objetivo

Chegar à estrutura `ui`, `components`, `blocks` e `utils` como fonte canônica do
pacote sem interromper os imports da versão 0.1.0 nem produzir entradas COSS
incompletas.

## Estado alvo

```text
apps/
  docs/
  storybook/
packages/tc96/
  src/
    ui/
    components/
    blocks/
    utils/
  registry/
  scripts/
tests/
  e2e/
```

## Mapa inicial

| Origem atual | Destino | Camada pública |
| --- | --- | --- |
| `src/view/kanban` | `src/blocks/kanban` | `tc96/blocks` |
| `src/view/list` | `src/blocks/list` | `tc96/blocks` |
| `src/view/collection` | `src/components/collection` | `tc96/components` |
| `src/datagrid/data-grid` | `src/blocks/data-grid` | `tc96/blocks` |
| `src/detail-sheet/components/detail-sheet` | `src/blocks/detail-sheet` | `tc96/blocks` |
| `src/filter-builder/filter-builder` | `src/blocks/filter-builder` | `tc96/blocks` |
| `src/properties/components/properties` | `src/components/properties` | `tc96/components` |
| `src/editable/components/editable` | `src/components/editable` | `tc96/components` |
| primitives duplicadas em cada grupo | `src/ui` | `tc96/ui` |
| `lib/utils.ts` duplicados | `src/utils` | `tc96/utils` |

## Etapas

### 0. Contratos e guardas

- [x] Registrar a unidade única de publicação e as regras de dependência.
- [x] Mapear os grupos atuais para as camadas de destino.
- [x] Proteger workspaces, exports públicos e entradas de registry com teste.

### 1. Registry antes da movimentação

- [ ] Fazer o gerador resolver dependências compartilhadas de cada item.
- [ ] Validar que todos os imports `@/` presentes em um item têm arquivo ou
  dependência correspondente.
- [ ] Adicionar teste de instalação COSS em um projeto temporário.

### 2. Camadas canônicas

- [ ] Migrar `utils` e primitives de `ui` sem alterar a API pública.
- [ ] Migrar `properties`, `editable` e `collection` para `components`.
- [ ] Migrar Kanban, List, DataGrid, Detail Sheet e Filter Builder para `blocks`.
- [ ] Remover os grupos históricos após o registry deixar de depender deles.

### 3. Aplicações consumidoras

- [ ] Criar `apps/storybook` consumindo apenas os subpaths públicos.
- [ ] Fazer Fumadocs importar exemplos pelos subpaths públicos.
- [ ] Adicionar Playwright somente para drag-and-drop, teclado, overlays, scroll
  e demais fluxos que exigem navegador real.

### 4. Release

- [ ] Instalar o tarball em um consumidor Vite mínimo.
- [ ] Validar lint, tipos, unitários, Storybook, docs, Playwright e npm pack.
- [ ] Remover compatibilidade estrutural temporária e publicar a versão definida.

## Critério de conclusão por migração

Uma unidade só sai do grupo histórico quando código, exports, testes, stories,
documentação e manifestos COSS forem atualizados juntos e o `release:check`
permanecer verde.
