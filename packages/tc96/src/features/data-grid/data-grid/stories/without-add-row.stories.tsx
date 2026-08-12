import { DataGridExample, records } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/without-add-row.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Without Add Row' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents a collection surface without row creation. Use this when records are read-only, created elsewhere, or gated by product permissions.',
    systemPrompt,
  ),
  render: () => <DataGridExample allowRowAdd={false} data={records} />,
}
