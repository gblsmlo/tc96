import { afterEach, describe, expect, test } from 'bun:test'

await import('../../../test/dom')

const { cleanup, fireEvent, render, screen } = await import('@testing-library/react')
const { StringProperty } = await import('./string-property')

afterEach(cleanup)

describe('StringProperty', () => {
  test('renders a read-only button when there is no updater', () => {
    render(<StringProperty readOnly value="Alpha" />)

    expect(screen.getByRole('button', { name: 'String: Alpha' })).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  test('emits string changes through onValueChange', () => {
    const changes: string[] = []
    render(
      <StringProperty
        ariaLabel="Title"
        value="Alpha"
        onValueChange={(nextValue) => changes.push(nextValue)}
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Title' })
    fireEvent.input(input, { target: { value: 'Beta' } })

    expect(changes).toEqual(['Beta'])
  })

  test('passes the previous value to an action callback', () => {
    const changes: Array<{ next: string; previous: string }> = []
    render(
      <StringProperty
        action={(value, context) =>
          changes.push({
            next: value,
            previous: context.previousValue,
          })
        }
        ariaLabel="Title"
        value="Alpha"
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Title' })
    fireEvent.input(input, { target: { value: 'Gamma' } })

    expect(changes).toEqual([{ next: 'Gamma', previous: 'Alpha' }])
  })
})
