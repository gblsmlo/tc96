'use client'

import { FunnelIcon, PlusIcon } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

import { Badge } from '../components/badge'
import { Button } from '../components/button'
import { Form } from '../components/form'
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from '../components/popover'
import { FilterConditionRow } from './filter-condition-row'
import {
  createFilterConditionDraft,
  type FilterBuilderAttribute,
  type FilterCondition,
  type FilterConditionDraft,
  isCompleteFilterCondition,
} from './types'

export interface FilterBuilderProps {
  attributes: readonly FilterBuilderAttribute[]
  onValueChange: (conditions: FilterCondition[]) => void
  triggerLabel?: string
  value: readonly FilterCondition[]
}

function createDraft(value: readonly FilterCondition[]): FilterConditionDraft[] {
  return value.length > 0
    ? value.map((condition) => createFilterConditionDraft(condition))
    : [createFilterConditionDraft()]
}

export function FilterBuilder({
  attributes,
  onValueChange,
  triggerLabel = 'Filtrar',
  value,
}: Readonly<FilterBuilderProps>): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<FilterConditionDraft[]>(() => createDraft(value))
  const canApply = draft.length > 0 && draft.every(isCompleteFilterCondition)

  function handleOpenChange(nextOpen: boolean): void {
    setDraft(createDraft(value))
    setOpen(nextOpen)
  }

  function updateCondition(index: number, condition: FilterConditionDraft): void {
    setDraft((current) =>
      current.map((currentCondition, currentIndex) =>
        currentIndex === index ? condition : currentCondition,
      ),
    )
  }

  function removeCondition(index: number): void {
    setDraft((current) => {
      const remaining = current.filter((_, currentIndex) => currentIndex !== index)
      return remaining.length > 0 ? remaining : [createFilterConditionDraft()]
    })
  }

  function apply(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (!canApply) {
      return
    }

    const completeConditions = draft.filter(isCompleteFilterCondition).map((condition) => ({
      attributeId: condition.attributeId,
      operator: condition.operator,
      value: condition.value,
    }))
    onValueChange(completeConditions)
    setOpen(false)
  }

  function clear(): void {
    onValueChange([])
    setDraft([createFilterConditionDraft()])
  }

  function cancel(): void {
    setOpen(false)
  }

  const isFilterEnabled = value.length > 0
  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger
        render={<Button aria-label={triggerLabel} type="button" variant="secondary" />}
      >
        <FunnelIcon />
        {triggerLabel}
        {isFilterEnabled && (
          <Badge aria-label={`${value.length} filtros aplicados`} variant="secondary">
            {value.length}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverPopup align="center" className="w-[min(36rem,var(--available-width))]">
        <Form className="grid gap-4" onSubmit={apply}>
          <div className="grid gap-1">
            <PopoverTitle>Filtros</PopoverTitle>
            <PopoverDescription>
              Monte as condições e aplique quando o filtro estiver completo.
            </PopoverDescription>
          </div>

          <div className="grid gap-2">
            {draft.map((condition, index) => (
              <FilterConditionRow
                attributes={attributes}
                condition={condition}
                index={index}
                key={condition.draftId}
                onChange={(nextCondition) => updateCondition(index, nextCondition)}
                onRemove={() => removeCondition(index)}
              />
            ))}
          </div>

          <Button
            onClick={() => setDraft((current) => [...current, createFilterConditionDraft()])}
            size="sm"
            type="button"
            variant="ghost"
          >
            <PlusIcon />
            Adicionar condição
          </Button>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
            <Button onClick={clear} size="sm" type="button" variant="ghost">
              Limpar filtros
            </Button>
            <div className="flex items-center gap-2">
              <Button onClick={cancel} size="sm" type="button" variant="outline">
                Cancelar
              </Button>
              <Button disabled={!canApply} size="sm" type="submit">
                Aplicar
              </Button>
            </div>
          </div>
        </Form>
      </PopoverPopup>
    </Popover>
  )
}
