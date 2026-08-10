export interface FilterBuilderOption {
  label: string
  value: string
}

export interface FilterBuilderAttribute {
  id: string
  label: string
  operators: readonly FilterBuilderOption[]
  options: readonly FilterBuilderOption[]
  valueType: 'select'
}

export interface FilterCondition {
  attributeId: string
  operator: string
  value: string
}

export interface FilterConditionDraft extends FilterCondition {
  draftId: string
}

let draftSequence = 0

function createDraftId(): string {
  draftSequence += 1
  return `filter-condition-${draftSequence}`
}

export function createFilterConditionDraft(condition?: FilterCondition): FilterConditionDraft {
  return {
    attributeId: condition?.attributeId ?? '',
    draftId: createDraftId(),
    operator: condition?.operator ?? '',
    value: condition?.value ?? '',
  }
}

export function isCompleteFilterCondition(condition: FilterCondition): boolean {
  return Boolean(condition.attributeId && condition.operator && condition.value)
}
