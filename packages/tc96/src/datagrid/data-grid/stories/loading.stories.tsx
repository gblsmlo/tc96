import { DataGridExample } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/loading.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Loading' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents the default loading state. Keep the same grid structure while data is being fetched so the collection surface remains stable.',
    systemPrompt,
  ),
  render: () => <DataGridExample data={[]} isLoading />,
}
