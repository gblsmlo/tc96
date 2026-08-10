import { afterEach, describe, expect, test } from 'bun:test'

await import('../../../test/dom')

const { cleanup, fireEvent, render, screen, waitFor } = await import('@testing-library/react')
const { MultiPersonProperty } = await import('./multi-person-property')

afterEach(cleanup)

const options = [
  {
    avatar: { fallback: 'AR' },
    description: 'alex@example.com',
    name: 'Alex Rivera',
    value: 'alex',
  },
  {
    avatar: { fallback: 'JL' },
    description: 'jordan@example.com',
    name: 'Jordan Lee',
    value: 'jordan',
  },
  { avatar: { fallback: 'SK' }, description: 'sam@example.com', name: 'Sam Kim', value: 'sam' },
] as const

describe('MultiPersonProperty', () => {
  test('renders selected people in read-only mode', () => {
    render(<MultiPersonProperty options={options} readOnly value={['alex', 'jordan']} />)

    expect(screen.getByText('Alex Rivera, Jordan Lee')).toBeTruthy()
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  test('renders an empty value with a consumer placeholder', () => {
    render(
      <MultiPersonProperty options={options} placeholder="Add assignees" readOnly value={[]} />,
    )

    expect(screen.getByText('Add assignees')).toBeTruthy()
  })

  test('adds and removes people', async () => {
    const changes: string[][] = []
    const { rerender } = render(
      <MultiPersonProperty
        ariaLabel="Assignees"
        options={options}
        value={['alex']}
        onValueChange={(value) => changes.push([...value])}
      />,
    )

    const trigger = screen.getByRole('combobox', { name: 'Assignees: Alex Rivera' })
    fireEvent.click(trigger)
    const jordanOption = await waitFor(() => screen.getByRole('option', { name: 'Jordan Lee' }))
    const selectedOption = screen.getByRole('option', { name: 'Alex Rivera' })
    expect(trigger.hasAttribute('data-popup-open')).toBe(true)
    expect(selectedOption.getAttribute('aria-selected')).toBe('true')
    expect(selectedOption.querySelector('[data-slot="select-item-indicator"]')).toBeTruthy()
    expect(jordanOption.getAttribute('aria-selected')).not.toBe('true')
    expect(screen.getByText('jordan@example.com')).toBeTruthy()
    fireEvent.pointerDown(jordanOption, { pointerType: 'mouse' })
    fireEvent.click(jordanOption)

    expect(changes).toEqual([['alex', 'jordan']])

    rerender(
      <MultiPersonProperty
        ariaLabel="Assignees"
        options={options}
        value={['alex', 'jordan']}
        onValueChange={(value) => changes.push([...value])}
      />,
    )
    const alexOption = screen.getByRole('option', { name: 'Alex Rivera' })
    fireEvent.pointerDown(alexOption, { pointerType: 'mouse' })
    fireEvent.click(alexOption)

    expect(changes).toEqual([['alex', 'jordan'], ['jordan']])
  })
})
