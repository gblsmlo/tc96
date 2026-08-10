# ADR-001: Um pacote com subpaths explícitos

## Contexto

Os blocos TC96 evoluíram como pacotes independentes. Isso multiplicou versões,
instalações e documentação, embora os projetos consumidores usem a mesma base:
React, Tailwind CSS, COSS, Base UI, Biome e TypeScript.

## Decisão

Publicar um único pacote npm chamado `tc96`, sem exportação raiz genérica. A API
pública usa uma taxonomia inspirada no shadcn/ui, com cada camada em um subpath
explícito:

| Camada | Importação | Conteúdo atual |
| --- | --- | --- |
| Primitivos | `tc96/ui` | Button e Input |
| Componentes | `tc96/components` | Properties e Editable |
| Blocos | `tc96/blocks` | Kanban, DataGrid, Detail Sheet e Filter Builder |
| Utilitários | `tc96/utils` | `cn` e futuras funções sem domínio |

Os grupos de origem (`view`, `properties`, `datagrid` e outros) continuam como
unidades de instalação no registry COSS, mas são internos ao pacote npm. O
consumidor escolhe a camada que importa e o bloco COSS que instala. TC96 não infere domínio,
permissões, busca remota, mutações ou persistência.

## Consequências

- Uma versão, uma documentação e um pipeline de qualidade.
- Imports tree-shakeable e sem colisões ambíguas de nomes na raiz.
- A taxonomia torna explícita a diferença entre primitives, componentes e
  experiências completas, sem expor a organização interna do repositório.
- COSS continua sendo uma rota de cópia de código por bloco, para que o projeto
  consumidor possa ajustar apenas o que decidiu possuir.
- Alterações em qualquer bloco exigem teste unitário, documentação e contrato de
  exportação no mesmo pull request.
