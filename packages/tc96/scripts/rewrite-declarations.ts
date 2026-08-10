import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

const dist = join(import.meta.dir, '../dist')
const internal = join(dist, 'internal')

const publicModules = {
  components: [
    "export * from '../internal/properties/index'",
    "export * from '../internal/editable/index'",
  ],
  blocks: [
    "export { KanbanView as Kanban } from '../internal/view/index'",
    "export * from '../internal/view/index'",
    "export * from '../internal/datagrid/index'",
    "export * from '../internal/detail-sheet/index'",
    "export * from '../internal/filter-builder/index'",
  ],
} as const

async function rewrite(directory: string, groupRoot: string): Promise<void> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name)

    if (entry.isDirectory()) {
      await rewrite(file, groupRoot)
      continue
    }

    if (!entry.name.endsWith('.d.ts')) continue

    const contents = await readFile(file, 'utf8')
    const rewritten = contents.replaceAll(/from (['"])@\/([^'"]+)\1/g, (_match, quote, target) => {
      const path = relative(dirname(file), join(groupRoot, target)).replaceAll('\\', '/')
      return `from ${quote}${path.startsWith('.') ? path : `./${path}`}${quote}`
    })

    if (rewritten !== contents) await writeFile(file, rewritten)
  }
}

for (const group of await readdir(internal)) {
  await rewrite(join(internal, group), join(internal, group))
}

for (const [module, exports] of Object.entries(publicModules)) {
  const output = join(dist, module)
  await mkdir(output, { recursive: true })
  await writeFile(join(output, 'index.d.ts'), `${exports.join('\n')}\n`)
}
