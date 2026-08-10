import { DataGridExample, records } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/single-select-cells.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Single Select Cells' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents the opt-in single-select cell primitive. The grid supplies the editing surface while the consumer owns allowed values, mutation, validation, and persistence.',
    systemPrompt,
  ),
  render: () => <DataGridExample data={records} />,
}
