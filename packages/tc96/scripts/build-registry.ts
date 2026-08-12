import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildRegistryGraph, type RegistrySourceFile } from './registry-graph'

const registrySources = {
  view: 'features/collection-views',
  properties: 'features/properties',
  datagrid: 'features/data-grid',
  'detail-sheet': 'features/detail-sheet',
  editable: 'features/editable',
  'filter-builder': 'features/filter-builder',
} as const
const root = import.meta.dir + '/..'
const output = join(root, 'registry/generated')

type RegistryFile = RegistrySourceFile
type RegistryItem = {
  files?: RegistryFile[]
  meta?: Record<string, unknown>
  registryDependencies?: string[]
  [key: string]: unknown
}
type Registry = { items: RegistryItem[]; [key: string]: unknown }

await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })

for (const [group, sourceDirectory] of Object.entries(registrySources)) {
  const source = join(root, `registry/${group}.json`)
  const registry = JSON.parse(await readFile(source, 'utf8')) as Registry
  if (registry.items.length === 0) throw new Error(`Registry ${group} does not contain an item.`)

  const items = await Promise.all(
    registry.items.map(async (item) => {
      const sourceFiles: RegistrySourceFile[] = (item.files ?? []).map((file) => ({
        ...file,
        path: `src/${sourceDirectory}/${file.path.replace(/^src\//, '')}`,
      }))
      const files = await buildRegistryGraph({
        files: sourceFiles,
        packageRoot: root,
        registryDependencies: item.registryDependencies,
        sourceRoot: `src/${sourceDirectory}`,
      })

      return { ...item, files, meta: { ...item.meta, package: 'tc96' } }
    }),
  )

  if (items.length !== 1) {
    throw new Error(
      `Registry ${group} must contain exactly one exported item; found ${items.length}.`,
    )
  }

  const item = items[0]
  if (!item) throw new Error(`Registry ${group} does not contain an item.`)

  await writeFile(
    join(output, `${group}.json`),
    JSON.stringify(
      {
        $schema: 'https://ui.shadcn.com/schema/registry-item.json',
        ...item,
      },
      null,
      2,
    ) + '\n',
  )
}

console.log(
  `Generated ${Object.keys(registrySources).length} self-contained TC96 COSS registry entries.`,
)
