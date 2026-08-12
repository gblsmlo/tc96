import { ColumnTypesExample } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/column-types.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Column Types' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents the supported semantic column metadata so consumers can choose column intent, labels, sizing, and default presentation deliberately.',
    systemPrompt,
  ),
  render: () => <ColumnTypesExample />,
}
