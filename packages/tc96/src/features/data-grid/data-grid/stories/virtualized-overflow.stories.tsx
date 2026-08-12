import { DataGridExample, overflowRecords } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/virtualized-overflow.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Virtualized Overflow' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents constrained-height collections with sticky headers and virtualized rows. Use this for large datasets where vertical scanning must stay responsive.',
    systemPrompt,
  ),
  render: () => (
    <DataGridExample
      actionLabel="Aplicar ação"
      allowRowAdd
      data={overflowRecords}
      maxHeight={420}
      showPagination={false}
      virtualize
    />
  ),
}
