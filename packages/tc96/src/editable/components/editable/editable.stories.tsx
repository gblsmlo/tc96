import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import {
  Editable,
  EditableArea,
  EditableCancel,
  EditableInput,
  EditableLabel,
  EditablePreview,
  EditableSubmit,
  EditableToolbar,
  EditableTrigger,
} from './editable'

const meta = {
  title: 'Editable',
  component: Editable,
  parameters: {
    docs: {
      description: {
        component:
          'A domain-neutral, accessible inline editing composition built with COSS conventions and Base UI rendering primitives.',
      },
    },
  },
} satisfies Meta<typeof Editable>

export default meta
type Story = StoryObj<typeof meta>

function EditableExample({
  defaultValue = 'Customer-facing title',
  triggerMode = 'click',
  autosize = false,
  disabled = false,
  onSubmit,
}: Readonly<{
  defaultValue?: string
  triggerMode?: 'click' | 'dblclick' | 'focus'
  autosize?: boolean
  disabled?: boolean
  onSubmit?: (value: string) => void
}>) {
  return (
    <Editable
      autosize={autosize}
      defaultValue={defaultValue}
      disabled={disabled}
      placeholder="Enter a value"
      triggerMode={triggerMode}
      onSubmit={onSubmit}
    >
      <EditableLabel>Title</EditableLabel>
      <EditableArea className="w-80">
        <EditablePreview className="flex-1" />
        <EditableInput />
      </EditableArea>
      <EditableTrigger>Edit</EditableTrigger>
      <EditableToolbar>
        <EditableSubmit>Save</EditableSubmit>
        <EditableCancel>Cancel</EditableCancel>
      </EditableToolbar>
    </Editable>
  )
}

export const Default: Story = {
  args: {
    onSubmit: fn(),
  },
  render: (args) => <EditableExample onSubmit={args.onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Customer-facing title' }))
    const input = canvas.getByRole('textbox', { name: 'Title' })
    await userEvent.clear(input)
    await userEvent.type(input, 'Updated title')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    await expect(args.onSubmit).toHaveBeenCalledWith('Updated title')
    await expect(canvas.getByRole('button', { name: 'Updated title' })).toBeInTheDocument()
  },
}

export const DoubleClick: Story = {
  render: () => <EditableExample defaultValue="Double click to edit" triggerMode="dblclick" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const preview = canvas.getByRole('button', { name: 'Double click to edit' })

    await userEvent.click(preview)
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument()

    await userEvent.dblClick(preview)
    await expect(canvas.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
  },
}

export const Autosize: Story = {
  render: () => <EditableExample autosize defaultValue="Autosize editable" />,
}

export const Disabled: Story = {
  render: () => <EditableExample disabled defaultValue="Editing disabled" />,
}

function ControlledExample() {
  const [value, setValue] = useState('Controlled value')
  return (
    <div className="space-y-3">
      <EditableExample defaultValue={value} onSubmit={setValue} />
      <p className="text-muted-foreground text-sm">Submitted value: {value}</p>
    </div>
  )
}

export const ControlledSubmission: Story = {
  render: () => <ControlledExample />,
}
