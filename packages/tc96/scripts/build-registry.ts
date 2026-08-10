import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const groups = ['view', 'properties', 'datagrid', 'detail-sheet', 'editable', 'filter-builder'] as const
const root = import.meta.dir + '/..'
const output = join(root, 'registry/generated')

type RegistryFile = { path: string; [key: string]: unknown }
type RegistryItem = { files?: RegistryFile[]; meta?: Record<string, unknown>; [key: string]: unknown }
type Registry = { items: RegistryItem[]; [key: string]: unknown }

await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })

for (const group of groups) {
  const source = join(root, `registry/${group}.json`)
  const registry = JSON.parse(await readFile(source, 'utf8')) as Registry
  const item = registry.items[0]

  if (!item) throw new Error(`Registry ${group} does not contain an item.`)

  const files = item.files?.map((file) => ({
    ...file,
    path: `src/${group}/${file.path.replace(/^src\//, '')}`,
  }))

  for (const file of files ?? []) {
    await stat(join(root, file.path))
  }

  await writeFile(
    join(output, `${group}.json`),
    JSON.stringify(
      {
        ...registry,
        name: 'tc96',
        homepage: 'https://github.com/gblsmlo/tc96',
        items: [{ ...item, files, meta: { ...item.meta, package: 'tc96' } }],
      },
      null,
      2,
    ) + '\n',
  )
}

console.log(`Generated ${groups.length} TC96 COSS registry entries.`)
