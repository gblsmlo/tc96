import { expect, test } from 'bun:test'

const packageJson = JSON.parse(await Bun.file(new URL('../package.json', import.meta.url)).text()) as {
  exports: Record<string, unknown>
}

test('keeps the public taxonomy behind explicit subpaths', () => {
  expect(Object.keys(packageJson.exports).sort()).toEqual([
    './blocks',
    './components',
    './registry/datagrid',
    './registry/detail-sheet',
    './registry/editable',
    './registry/filter-builder',
    './registry/properties',
    './registry/view',
    './ui',
    './utils',
  ])
})
