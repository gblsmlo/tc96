import { expect, test } from 'bun:test'

const ui = await import('../dist/ui/index.js')
const components = await import('../dist/components/index.js')
const blocks = await import('../dist/blocks/index.js')
const utils = await import('../dist/utils/index.js')

test('loads the four documented public modules', () => {
  expect(ui.Button).toBeDefined()
  expect(ui.Input).toBeDefined()
  expect(components.SelectProperty).toBeDefined()
  expect(components.Editable).toBeDefined()
  expect(blocks.Kanban).toBeDefined()
  expect(blocks.DataGrid).toBeDefined()
  expect(blocks.DetailSheet).toBeDefined()
  expect(blocks.FilterBuilder).toBeDefined()
  expect(utils.cn('tc96')).toBe('tc96')
})
