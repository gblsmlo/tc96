# Plano de desenvolvimento

## 1. Fundação e portabilidade — concluída

- [x] Criar o workspace `tc96` sem alterar os repositórios de origem.
- [x] Portar view, properties, datagrid, detail-sheet, editable e filter-builder.
- [x] Definir o contrato único de imports por subpath.
- [x] Preservar as camadas de testes já existentes e adicionar uma guarda de exports.
- [x] Normalizar os manifests de registry COSS para o pacote consolidado.
- [x] Instalar dependências e corrigir incompatibilidades reais da consolidação.

## 2. Migração estrutural — concluída

- [x] Definir o monorepo com uma única unidade de publicação.
- [x] Registrar as regras entre `ui`, `components`, `blocks` e `utils`.
- [x] Criar guardas de workspaces, subpaths e registry.
- [x] Tornar o registry capaz de resolver dependências compartilhadas e publicar
  payloads autocontidos.
- [x] Organizar fontes por feature e manter as quatro camadas como fachadas públicas.
- [x] Colocar primitives e utilitários canônicos em `shared`.
- [x] Colocar build, tipos, testes e registry sob as mesmas fronteiras de feature.

## 3. Sistema base

- Definir tokens de tamanho e variantes para Button, Input e controles de campo.
- Criar componentes base COSS somente quando houver um contrato reutilizável.
- Migrar cada bloco para consumir esses tokens, sem impor semântica de produto.

## 4. Documentação e catálogo

- Montar o app de documentação Vite com Fumadocs MDX.
- Publicar página por subpath: instalação npm, instalação COSS, API, acessibilidade
  e limites de responsabilidade.
- Manter Storybook para desenvolvimento visual e interações de componentes.

## 5. Qualidade e entrega

- Rodar Biome, TypeScript, Bun test, build do pacote e build de documentação no CI.
- Usar Playwright apenas para fluxos browser que não possam ser cobertos com Bun test
  ou interações Storybook.
- Publicar uma versão de migração com tabela dos nomes antigos para os novos imports.
