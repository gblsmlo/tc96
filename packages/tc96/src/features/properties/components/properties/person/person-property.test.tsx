import { afterEach, describe, expect, test } from 'bun:test'

await import('../../../test/dom')

const { cleanup, fireEvent, render, screen, waitFor } = await import('@testing-library/react')
const { PersonProperty } = await import('./person-property')

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

describe('PersonProperty', () => {
  test('renders a person button in read-only mode', () => {
    render(<PersonProperty options={options} readOnly value="jordan" />)

    expect(screen.getByText('Jordan Lee')).toBeTruthy()
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  test('renders an empty value with a consumer placeholder', () => {
    render(<PersonProperty options={options} placeholder="Select a person" readOnly value={null} />)

    expect(screen.getByText('Select a person')).toBeTruthy()
  })

  test('emits the selected person value', async () => {
    const changes: Array<string | null> = []
    render(
      <PersonProperty
        ariaLabel="Person"
        options={options}
        value="alex"
        onValueChange={(value) => changes.push(value)}
      />,
    )

    const trigger = screen.getByRole('combobox', { name: 'Person: Alex Rivera' })
    fireEvent.click(trigger)
    const option = await waitFor(() => screen.getByRole('option', { name: 'Sam Kim' }))
    const selectedOption = screen.getByRole('option', { name: 'Alex Rivera' })
    expect(trigger.hasAttribute('data-popup-open')).toBe(true)
    expect(selectedOption.getAttribute('aria-selected')).toBe('true')
    expect(selectedOption.querySelector('[data-slot="select-item-indicator"]')).toBeTruthy()
    expect(screen.getByText('sam@example.com')).toBeTruthy()
    fireEvent.pointerDown(option, { pointerType: 'mouse' })
    fireEvent.click(option)

    expect(changes).toEqual(['sam'])
  })

  test('clears the selected person', async () => {
    const changes: Array<string | null> = []
    render(
      <PersonProperty
        ariaLabel="Owner"
        options={options}
        value="alex"
        onValueChange={(value) => changes.push(value)}
      />,
    )

    fireEvent.click(screen.getByRole('combobox', { name: 'Owner: Alex Rivera' }))
    const clearOption = await waitFor(() => screen.getByRole('option', { name: 'Clear person' }))
    fireEvent.pointerDown(clearOption, { pointerType: 'mouse' })
    fireEvent.click(clearOption)

    expect(changes).toEqual([null])
  })
})
