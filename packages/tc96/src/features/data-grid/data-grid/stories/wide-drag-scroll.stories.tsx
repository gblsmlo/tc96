import { WideDragScrollExample } from './data-grid-story-fixtures'
import { dataGridMeta, type DataGridStory, storyParameters } from './data-grid-story-meta'
import systemPrompt from './prompts/wide-drag-scroll.system-prompt.md?raw'

const meta = { ...dataGridMeta, title: 'Wide Drag Scroll' }
export default meta

export const Default: DataGridStory = {
  parameters: storyParameters(
    'Documents horizontal overflow behavior with drag scrolling and explicitly pinned edges. Drag scroll should appear only when columns exceed the wrapper width.',
    systemPrompt,
  ),
  render: () => <WideDragScrollExample />,
}
