# ADR-003: Fontes organizados por feature

## Status

Aceito.

## Contexto

O pacote expõe quatro camadas públicas, mas sua implementação havia sido copiada
de seis pacotes históricos. Isso deixava API e árvore de fontes com taxonomias
diferentes, duplicava configurações na raiz e fazia build e registry conhecerem
nomes que não representavam mais a arquitetura do TC96.

## Opções consideradas

| Opção | Vantagens | Custos |
| --- | --- | --- |
| Implementação por camada pública | Árvore igual à API | Código de uma experiência fica espalhado |
| Uma feature para cada componente | Isolamento máximo | Ciclos artificiais em Collection, Kanban e List |
| Features coesas com fachadas públicas | Mudanças ficam agrupadas | Exige mapeamento explícito no build e registry |

## Decisão

Organizar fontes em `src/features` e fundações em `src/shared`. As pastas
`src/ui`, `src/components`, `src/blocks` e `src/utils` são fachadas do contrato
público e não contêm implementação.

Collection, Kanban e List formam `collection-views`, pois são uma única
experiência composta. Properties, Editable, Data Grid, Detail Sheet e Filter
Builder permanecem features independentes.

Cada feature possui configuração TypeScript, testes e estilos próximos do
código. O registry mantém seus identificadores externos, mas resolve as fontes
por um mapa explícito para `src/features`.

## Regras

- `shared/utils` não depende de React ou UI;
- `shared/ui` pode depender de `shared/utils`;
- uma feature mantém componentes, hooks, tipos, testes e adapters locais;
- uma feature não importa fachadas públicas;
- as fachadas públicas apenas reexportam features ou módulos compartilhados;
- uma dependência entre features exige uma decisão arquitetural explícita.

## Consequências

- a feature passa a ser a unidade de manutenção e validação;
- os subpaths públicos permanecem estáveis;
- os nomes históricos sobrevivem somente como compatibilidade do registry;
- código COSS específico de uma feature pode continuar local mesmo quando se
  parece com uma primitive compartilhada, porque possui outro modelo de
  distribuição.
