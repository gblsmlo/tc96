import { afterEach, describe, expect, test } from 'bun:test'

await import('@/test/dom')

const { cleanup, fireEvent, render, screen, waitFor } = await import('@testing-library/react')
const { CircleIcon, SquareIcon, TriangleIcon } = await import('lucide-react')
const { SelectProperty } = await import('./select-property')

afterEach(cleanup)

const options = [
  { icon: CircleIcon, id: 'alpha', label: 'Alpha' },
  { icon: SquareIcon, id: 'beta', label: 'Beta' },
  { icon: TriangleIcon, id: 'gamma', label: 'Gamma' },
] as const

describe('SelectProperty', () => {
  test('renders the selected option as a read-only button', () => {
    render(<SelectProperty options={options} readOnly value="beta" />)

    expect(screen.getByText('Beta')).toBeTruthy()
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  test('renders every option and emits the selected value', async () => {
    const changes: string[] = []
    render(
      <SelectProperty
        ariaLabel="Category"
        dropdownClassName="min-w-72"
        options={options}
        value="beta"
        onValueChange={(value) => changes.push(value)}
      />,
    )

    const trigger = screen.getByRole('combobox', { name: 'Category: Beta' })
    fireEvent.click(trigger)

    const alphaOption = await waitFor(() => screen.getByRole('option', { name: 'Alpha' }))
    const selectedOption = screen.getByRole('option', { name: 'Beta' })
    expect(trigger.hasAttribute('data-popup-open')).toBe(true)
    expect(trigger.className).toContain('data-popup-open:bg-accent')
    expect(selectedOption.closest('[data-slot="select-list"]')?.className).toContain('min-w-72')
    expect(alphaOption.getAttribute('aria-selected')).not.toBe('true')
    expect(selectedOption.getAttribute('aria-selected')).toBe('true')
    expect(selectedOption.hasAttribute('data-selected')).toBe(true)
    expect(selectedOption.querySelector('[data-slot="select-item-indicator"]')).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Gamma' })).toBeTruthy()

    const option = screen.getByRole('option', { name: 'Gamma' })
    fireEvent.pointerDown(option, { pointerType: 'mouse' })
    fireEvent.click(option)

    expect(changes).toEqual(['gamma'])
  })

  test('passes the option and previous value to an action', async () => {
    const changes: Array<{ next: string; previous: string; label: string }> = []
    render(
      <SelectProperty
        action={(value, context) =>
          changes.push({
            label: context.option.label,
            next: value,
            previous: context.previousValue,
          })
        }
        ariaLabel="Category"
        options={options}
        value="alpha"
      />,
    )

    fireEvent.click(screen.getByRole('combobox', { name: 'Category: Alpha' }))
    const option = await waitFor(() => screen.getByRole('option', { name: 'Beta' }))
    fireEvent.pointerDown(option, { pointerType: 'mouse' })
    fireEvent.click(option)

    expect(changes).toEqual([{ label: 'Beta', next: 'beta', previous: 'alpha' }])
  })
})
