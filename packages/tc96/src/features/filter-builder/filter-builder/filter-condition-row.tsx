'use client'

import { XIcon } from 'lucide-react'
import type React from 'react'

import { Button } from '../components/button'
import { Group, GroupSeparator, GroupText } from '../components/group'
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '../components/select'
import type { FilterBuilderAttribute, FilterConditionDraft } from './types'

interface FilterConditionRowProps {
  attributes: readonly FilterBuilderAttribute[]
  condition: FilterConditionDraft
  index: number
  onChange: (condition: FilterConditionDraft) => void
  onRemove: () => void
}

export function FilterConditionRow({
  attributes,
  condition,
  index,
  onChange,
  onRemove,
}: Readonly<FilterConditionRowProps>): React.ReactElement {
  const selectedAttribute = attributes.find((attribute) => attribute.id === condition.attributeId)
  const attributeItems = attributes.map((attribute) => ({
    label: attribute.label,
    value: attribute.id,
  }))
  const rowNumber = index + 1

  function selectAttribute(attributeId: string): void {
    const nextAttribute = attributes.find((attribute) => attribute.id === attributeId)
    const operator = nextAttribute?.operators.some((option) => option.value === condition.operator)
      ? condition.operator
      : ''
    const value = nextAttribute?.options.some((option) => option.value === condition.value)
      ? condition.value
      : ''

    onChange({ ...condition, attributeId, operator, value })
  }

  return (
    <Group aria-label={`Condição ${rowNumber}`} className="max-w-full flex-wrap sm:flex-nowrap">
      <GroupText className="h-8 min-w-14 justify-center px-2.5">
        {index === 0 ? 'Onde' : 'E'}
      </GroupText>
      <GroupSeparator className="hidden sm:block" />
      <Select
        items={attributeItems}
        onValueChange={(value) => selectAttribute(String(value ?? ''))}
        value={condition.attributeId || null}
      >
        <SelectTrigger aria-label={`Atributo da condição ${rowNumber}`} className="min-w-36 flex-1">
          <SelectValue placeholder="Atributo" />
        </SelectTrigger>
        <SelectPopup alignItemWithTrigger={false}>
          <SelectLabel>Atributo</SelectLabel>
          {attributes.map((attribute) => (
            <SelectItem key={attribute.id} value={attribute.id}>
              {attribute.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      <GroupSeparator className="hidden sm:block" />
      <Select
        disabled={!selectedAttribute}
        items={selectedAttribute?.operators ?? []}
        onValueChange={(value) =>
          onChange({ ...condition, operator: String(value ?? ''), value: '' })
        }
        value={condition.operator || null}
      >
        <SelectTrigger aria-label={`Operador da condição ${rowNumber}`} className="min-w-32 flex-1">
          <SelectValue placeholder="Operador" />
        </SelectTrigger>
        <SelectPopup alignItemWithTrigger={false}>
          <SelectLabel>Operador</SelectLabel>
          {selectedAttribute?.operators.map((operator) => (
            <SelectItem key={operator.value} value={operator.value}>
              {operator.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      <GroupSeparator className="hidden sm:block" />
      <Select
        disabled={!selectedAttribute || !condition.operator}
        items={selectedAttribute?.options ?? []}
        onValueChange={(value) => onChange({ ...condition, value: String(value ?? '') })}
        value={condition.value || null}
      >
        <SelectTrigger aria-label={`Valor da condição ${rowNumber}`} className="min-w-36 flex-1">
          <SelectValue placeholder="Valor" />
        </SelectTrigger>

        <SelectPopup alignItemWithTrigger={false}>
          <SelectLabel>Valor</SelectLabel>
          {selectedAttribute?.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      <GroupSeparator className="hidden sm:block" />

      <Button
        aria-label={`Remover condição ${rowNumber}`}
        onClick={onRemove}
        type="button"
        variant="outline"
      >
        <XIcon />
      </Button>
    </Group>
  )
}
