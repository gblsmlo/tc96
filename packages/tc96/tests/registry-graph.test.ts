import { describe, expect, test } from 'bun:test'
import { readFile } from 'node:fs/promises'
import { join, posix } from 'node:path'
import {
  buildRegistryGraph,
  parseModuleSpecifiers,
  type GeneratedRegistryFile,
} from '../scripts/registry-graph'

const groups = ['view', 'properties', 'datagrid', 'detail-sheet', 'editable', 'filter-builder']
const root = join(import.meta.dir, '..')

interface GeneratedRegistryItem {
  files: GeneratedRegistryFile[]
  registryDependencies?: string[]
}

function resolvesToTarget(from: string, specifier: string, targets: Set<string>) {
  const candidate = posix.normalize(posix.join(posix.dirname(from), specifier))
  return [candidate, `${candidate}.ts`, `${candidate}.tsx`, `${candidate}.css`, `${candidate}/index.ts`, `${candidate}/index.tsx`].some(
    (path) => targets.has(path),
  )
}

describe('self-contained COSS registry', () => {
  for (const group of groups) {
    test(`${group} embeds every file and resolves every local import`, async () => {
      const registry = JSON.parse(
        await readFile(join(root, `registry/generated/${group}.json`), 'utf8'),
      ) as GeneratedRegistryItem

      const targets = new Set(registry.files.map((file) => file.target))
      expect(targets.size).toBe(registry.files.length)

      for (const file of registry.files) {
        expect(file.content.length).toBeGreaterThan(0)

        for (const { specifier } of parseModuleSpecifiers(file.content, file.path)) {
          if (specifier.startsWith('.')) {
            expect(resolvesToTarget(file.target, specifier, targets)).toBeTrue()
          }

          if (specifier.startsWith('@/components/ui/')) {
            const primitive = specifier.slice('@/components/ui/'.length).split('/')[0]
            expect(registry.registryDependencies).toContain(`@coss/${primitive}`)
          } else {
            expect(specifier.startsWith('@/')).toBeFalse()
          }
        }
      }
    })
  }

  test('discovers transitive shared files from a minimal entry point', async () => {
    const registry = JSON.parse(
      await readFile(join(root, 'registry/view.json'), 'utf8'),
    ) as { items: GeneratedRegistryItem[] }
    const files = await buildRegistryGraph({
      files: [
        {
          path: 'src/view/index.ts',
          target: '@components/patterns/collection-views/index.ts',
          type: 'registry:component',
        },
      ],
      packageRoot: root,
      registryDependencies: registry.items[0]?.registryDependencies,
      sourceRoot: 'src/view',
    })

    expect(files.length).toBeGreaterThan(20)
    expect(files.some((file) => file.path === 'src/view/lib/utils.ts')).toBeTrue()
    expect(files.some((file) => file.path === 'src/view/kanban/types.ts')).toBeTrue()
  })
})
