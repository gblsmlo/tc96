import { expect, test } from 'bun:test'

const packageJson = JSON.parse(await Bun.file(new URL('../package.json', import.meta.url)).text()) as {
  exports: Record<string, unknown>
}

test('keeps each ported group behind an explicit public subpath', () => {
  expect(Object.keys(packageJson.exports).sort()).toEqual([
    './datagrid',
    './datagrid/core',
    './detail-sheet',
    './detail-sheet/core',
    './editable',
    './editable/core',
    './filter-builder',
    './filter-builder/core',
    './properties',
    './properties/core',
    './registry/datagrid',
    './registry/detail-sheet',
    './registry/editable',
    './registry/filter-builder',
    './registry/properties',
    './registry/view',
    './view',
    './view/core',
  ])
})
