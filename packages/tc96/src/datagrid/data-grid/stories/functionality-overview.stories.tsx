import { DataGridExample, records } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/functionality-overview.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Functionality Overview' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents the full collection pattern: toolbar controls, stable selection, pagination, row creation, and contextual actions composed without moving product semantics into the package.',
    systemPrompt,
  ),
  render: () => (
    <DataGridExample
      actionLabel="Aplicar ação"
      allowRowAdd
      data={records}
      initialSelectedId="record-1"
    />
  ),
}
