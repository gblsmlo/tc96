import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { FilterBuilder } from './filter-builder'
import type { FilterBuilderAttribute, FilterCondition } from './types'

const attributes = [
  {
    id: 'category',
    label: 'Category',
    operators: [
      { label: 'is', value: 'is' },
      { label: 'is not', value: 'is-not' },
    ],
    options: [
      { label: 'Alpha', value: 'alpha' },
      { label: 'Bravo', value: 'bravo' },
      { label: 'Charlie', value: 'charlie' },
    ],
    valueType: 'select',
  },
  {
    id: 'level',
    label: 'Level',
    operators: [{ label: 'is', value: 'is' }],
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
    valueType: 'select',
  },
] satisfies FilterBuilderAttribute[]

interface FilterBuilderStoryProps {
  initialValue?: readonly FilterCondition[]
}

function FilterBuilderStory({ initialValue = [] }: Readonly<FilterBuilderStoryProps>) {
  const [value, setValue] = useState<FilterCondition[]>(() => [...initialValue])
  return <FilterBuilder attributes={attributes} onValueChange={setValue} value={value} />
}

const meta = {
  component: FilterBuilderStory,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  title: 'Patterns/FilterBuilder',
} satisfies Meta<typeof FilterBuilderStory>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => <FilterBuilderStory />,
}

export const SingleCondition: Story = {
  render: () => (
    <FilterBuilderStory
      initialValue={[{ attributeId: 'category', operator: 'is', value: 'alpha' }]}
    />
  ),
}

export const MultipleConditions: Story = {
  render: () => (
    <FilterBuilderStory
      initialValue={[
        { attributeId: 'category', operator: 'is', value: 'alpha' },
        { attributeId: 'level', operator: 'is', value: 'high' },
      ]}
    />
  ),
}

export const AppliedFilters: Story = {
  render: () => (
    <FilterBuilderStory
      initialValue={[
        { attributeId: 'category', operator: 'is-not', value: 'charlie' },
        { attributeId: 'level', operator: 'is', value: 'high' },
      ]}
    />
  ),
}

export const IncompleteCondition: Story = {
  render: () => <FilterBuilderStory />,
}
