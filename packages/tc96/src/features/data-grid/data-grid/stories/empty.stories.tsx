import { DataGridExample } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/empty.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Empty' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents the successful empty state. The consumer owns the message because empty copy depends on filters, permissions, and product vocabulary.',
    systemPrompt,
  ),
  render: () => <DataGridExample data={[]} emptyMessage="Nenhum registro para exibir." />,
}
