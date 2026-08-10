import { DataGridExample, records } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/medium-density.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Medium Density' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents the medium density preset for balanced collection screens where rows need to stay scannable without becoming overly compressed.',
    systemPrompt,
  ),
  render: () => <DataGridExample data={records} density="medium" />,
}
