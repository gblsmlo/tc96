# ADR-001: Um pacote com subpaths explícitos

## Contexto

Os blocos TC96 evoluíram como pacotes independentes. Isso multiplicou versões,
instalações e documentação, embora os projetos consumidores usem a mesma base:
React, Tailwind CSS, COSS, Base UI, Biome e TypeScript.

## Decisão

Publicar um único pacote npm chamado `tc96`, sem exportação raiz genérica. Cada
família é um subpath explícito:

| Família | Importação | Instalação COSS |
| --- | --- | --- |
| Collection views e Kanban | `tc96/view` | bloco `view` |
| Properties | `tc96/properties` | bloco `properties` |
| DataGrid | `tc96/datagrid` | bloco `datagrid` |
| Detail sheet | `tc96/detail-sheet` | bloco `detail-sheet` |
| Editable | `tc96/editable` | bloco `editable` |
| Filter builder | `tc96/filter-builder` | bloco `filter-builder` |

O consumidor escolhe o que instala e importa. TC96 não infere domínio,
permissões, busca remota, mutações ou persistência.

## Consequências

- Uma versão, uma documentação e um pipeline de qualidade.
- Imports tree-shakeable e sem colisões ambíguas de nomes na raiz.
- COSS continua sendo uma rota de cópia de código por bloco, para que o projeto
  consumidor possa ajustar apenas o que decidiu possuir.
- Alterações em qualquer bloco exigem teste unitário, documentação e contrato de
  exportação no mesmo pull request.
