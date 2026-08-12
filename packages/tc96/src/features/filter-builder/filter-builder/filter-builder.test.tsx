import { afterEach, describe, expect, mock, test } from 'bun:test'
import {
  cloneElement,
  createContext,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useContext,
  useState,
} from 'react'

await import('../test/dom')

const { cleanup, fireEvent, render, screen } = await import('@testing-library/react')

const popoverContext = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

mock.module('../components/popover', () => ({
  Popover: ({
    children,
    onOpenChange,
    open,
  }: {
    children: ReactNode
    onOpenChange: (open: boolean) => void
    open: boolean
  }) => (
    <popoverContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </popoverContext.Provider>
  ),
  PopoverDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  PopoverPopup: ({ children }: { children: ReactNode }) => {
    const context = useContext(popoverContext)
    if (!context?.open) {
      return null
    }
    return (
      <div
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Escape') {
            context.setOpen(false)
          }
        }}
        role="dialog"
      >
        {children}
      </div>
    )
  },
  PopoverTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  PopoverTrigger: ({
    children,
    render: trigger,
  }: {
    children: ReactNode
    render: ReactElement<{ children?: ReactNode; onClick?: () => void }>
  }) => {
    const context = useContext(popoverContext)
    return cloneElement(trigger, {
      children,
      onClick: () => context?.setOpen(!context.open),
    })
  },
}))

const selectContext = createContext<{
  onValueChange?: (value: string) => void
  value?: string | null
} | null>(null)

mock.module('../components/select', () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: ReactNode
    onValueChange?: (value: string) => void
    value?: string | null
  }) => (
    <selectContext.Provider value={{ onValueChange, value }}>{children}</selectContext.Provider>
  ),
  SelectItem: ({ children, value }: { children: ReactNode; value: string }) => {
    const context = useContext(selectContext)
    return (
      <button type="button" onClick={() => context?.onValueChange?.(value)}>
        {children}
      </button>
    )
  },
  SelectLabel: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  SelectPopup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ 'aria-label': ariaLabel }: { 'aria-label': string }) => {
    const context = useContext(selectContext)
    return <button aria-label={ariaLabel} data-value={context?.value ?? ''} type="button" />
  },
  SelectValue: () => null,
}))

const filterBuilderModule = './filter-builder'
const { FilterBuilder } = await import(filterBuilderModule)
const typesModule = './types'
const { isCompleteFilterCondition } = await import(typesModule)

const attributes = [
  {
    id: 'status',
    label: 'Status',
    operators: [
      { label: 'É', value: 'is' },
      { label: 'Não é', value: 'is-not' },
    ],
    options: [
      { label: 'Em andamento', value: 'in-progress' },
      { label: 'Concluída', value: 'done' },
    ],
    valueType: 'select',
  },
  {
    id: 'priority',
    label: 'Prioridade',
    operators: [{ label: 'É', value: 'is' }],
    options: [
      { label: 'Alta', value: 'high' },
      { label: 'Baixa', value: 'low' },
    ],
    valueType: 'select',
  },
] as const

afterEach(cleanup)

describe('FilterBuilder', () => {
  test('discards an incompatible draft change when Escape closes the popover', () => {
    render(
      <FilterBuilder
        attributes={attributes}
        onValueChange={() => undefined}
        value={[{ attributeId: 'status', operator: 'is', value: 'done' }]}
      />,
    )

    expect(screen.getByRole('button', { name: 'Filtrar' }).textContent).toContain('1')
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(screen.getByText('Onde')).toBeTruthy()
    expect(screen.getByLabelText('Atributo da condição 1').getAttribute('data-value')).toBe(
      'status',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Prioridade' }))
    expect(screen.getByLabelText('Operador da condição 1').getAttribute('data-value')).toBe('is')
    expect(screen.getByLabelText('Valor da condição 1').getAttribute('data-value')).toBe('')
    expect(screen.getByRole('button', { name: 'Aplicar' }).hasAttribute('disabled')).toBe(true)

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(screen.getByLabelText('Atributo da condição 1').getAttribute('data-value')).toBe(
      'status',
    )
    expect(screen.getByLabelText('Valor da condição 1').getAttribute('data-value')).toBe('done')
  })

  test('applies only complete conditions and clears back to one empty row', () => {
    function Harness() {
      const [value, setValue] = useState<
        Array<{ attributeId: string; operator: string; value: string }>
      >([])
      return <FilterBuilder attributes={attributes} onValueChange={setValue} value={value} />
    }

    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))

    fireEvent.click(screen.getByRole('button', { name: 'Status' }))
    fireEvent.click(screen.getByRole('button', { name: 'É' }))
    fireEvent.click(screen.getByRole('button', { name: 'Concluída' }))
    expect(screen.getByRole('button', { name: 'Aplicar' }).hasAttribute('disabled')).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))

    expect(screen.getByRole('button', { name: 'Filtrar' }).textContent).toContain('1')
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar condição' }))
    expect(screen.getByText('E')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Remover condição 2' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(screen.getByRole('button', { name: 'Filtrar' }).textContent).not.toContain('1')
    expect(screen.getAllByLabelText(/Atributo da condição/)).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Aplicar' }).hasAttribute('disabled')).toBe(true)
  })
})

describe('isCompleteFilterCondition', () => {
  test('accepts only conditions with attribute, operator, and value', () => {
    expect(
      isCompleteFilterCondition({ attributeId: 'status', operator: 'is', value: 'done' }),
    ).toBe(true)
    expect(isCompleteFilterCondition({ attributeId: 'status', operator: 'is', value: '' })).toBe(
      false,
    )
  })
})
