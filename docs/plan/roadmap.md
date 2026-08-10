# Plano de desenvolvimento

## 1. Fundação e portabilidade — em andamento

- [x] Criar o workspace `tc96` sem alterar os repositórios de origem.
- [x] Portar view, properties, datagrid, detail-sheet, editable e filter-builder.
- [x] Definir o contrato único de imports por subpath.
- [x] Preservar as camadas de testes já existentes e adicionar uma guarda de exports.
- [ ] Normalizar os manifests de registry COSS para os novos caminhos.
- [ ] Instalar dependências e corrigir incompatibilidades reais da consolidação.

## 2. Sistema base

- Definir tokens de tamanho e variantes para Button, Input e controles de campo.
- Criar componentes base COSS somente quando houver um contrato reutilizável.
- Migrar cada bloco para consumir esses tokens, sem impor semântica de produto.

## 3. Documentação e catálogo

- Montar o app de documentação Vite com Fumadocs MDX.
- Publicar página por subpath: instalação npm, instalação COSS, API, acessibilidade
  e limites de responsabilidade.
- Manter Storybook para desenvolvimento visual e interações de componentes.

## 4. Qualidade e entrega

- Rodar Biome, TypeScript, Bun test, build do pacote e build de documentação no CI.
- Usar Playwright apenas para fluxos browser que não possam ser cobertos com Bun test
  ou interações Storybook.
- Publicar uma versão de migração com tabela dos nomes antigos para os novos imports.
