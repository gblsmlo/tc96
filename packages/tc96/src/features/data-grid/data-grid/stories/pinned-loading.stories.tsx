import { DataGridExample } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/pinned-loading.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Pinned Loading' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents loading with explicit pinned columns. Use it to keep row context visible while preserving the same visual rules used by loaded rows.',
    systemPrompt,
  ),
  render: () => <DataGridExample data={[]} isLoading pinOuterColumns showPagination={false} />,
}
