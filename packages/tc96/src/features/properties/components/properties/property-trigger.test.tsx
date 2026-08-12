import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { DateProperty } = await import('./date/date-property')
const { MultiPersonProperty } = await import('./person/multi-person-property')
const { PersonProperty } = await import('./person/person-property')
const { SelectProperty } = await import('./select/select-property')

afterEach(cleanup)

const selectOptions = [
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'High' },
] as const

const personOptions = [
  { description: 'Design', name: 'Ana Lima', value: 'ana' },
  { description: 'Engineering', name: 'Bruno Melo', value: 'bruno' },
] as const

describe('property triggers', () => {
  test('uses the same button surface for every interactive property', () => {
    render(
      <div>
        <SelectProperty
          ariaLabel="Priority"
          options={selectOptions}
          value="normal"
          onValueChange={() => undefined}
        />
        <PersonProperty
          ariaLabel="Owner"
          options={personOptions}
          value="ana"
          onValueChange={() => undefined}
        />
        <MultiPersonProperty
          ariaLabel="Assignees"
          options={personOptions}
          value={['ana', 'bruno']}
          onValueChange={() => undefined}
        />
        <DateProperty
          ariaLabel="Due date"
          locale="en-US"
          timeZone="UTC"
          value="2026-07-24T12:00:00.000Z"
          onValueChange={() => undefined}
        />
      </div>,
    )

    const triggers = [
      screen.getByRole('combobox', { name: 'Priority: Normal' }),
      screen.getByRole('combobox', { name: 'Owner: Ana Lima' }),
      screen.getByRole('combobox', { name: 'Assignees: Ana Lima, Bruno Melo' }),
      screen.getByRole('button', { name: 'Due date: Jul 24, 2026' }),
    ]

    expect(new Set(triggers.map((trigger) => trigger.className)).size).toBe(1)

    for (const trigger of triggers) {
      const classNames = new Set(trigger.className.split(/\s+/))

      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger.getAttribute('data-slot')).toBe('property-trigger')
      expect(classNames.has('h-8')).toBe(true)
      expect(classNames.has('sm:h-8')).toBe(true)
      expect(classNames.has('px-2')).toBe(true)
      expect(classNames.has('bg-transparent')).toBe(true)
      expect(classNames.has('hover:bg-accent')).toBe(true)
      expect(classNames.has('data-popup-open:bg-accent')).toBe(true)
      expect(classNames.has("sm:[&_svg:not([class*='size-'])]:size-4")).toBe(true)
      expect(classNames.has('min-h-9')).toBe(false)
      expect(classNames.has('min-w-36')).toBe(false)
      expect(classNames.has('w-full')).toBe(false)
      expect(classNames.has('border-input')).toBe(false)
      expect(classNames.has('bg-background')).toBe(false)
      expect([...classNames].some((className) => className.startsWith('shadow-xs'))).toBe(false)
    }
  })
})
