import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const groups = ['view', 'properties', 'datagrid', 'detail-sheet', 'editable', 'filter-builder'] as const
const root = import.meta.dir + '/..'

const publicModules = {
  ui: [
    "export { Button, buttonVariants } from '../internal/view/components/ui/button.js'",
    "export { Input, InputPrimitive } from '../internal/properties/components/ui/input.js'",
  ],
  components: [
    "export * from '../internal/properties/index.js'",
    "export * from '../internal/editable/index.js'",
  ],
  blocks: [
    "export { KanbanView as Kanban } from '../internal/view/index.js'",
    "export * from '../internal/view/index.js'",
    "export * from '../internal/datagrid/index.js'",
    "export * from '../internal/detail-sheet/index.js'",
    "export * from '../internal/filter-builder/index.js'",
  ],
  utils: ["export { cn } from '../internal/view/lib/utils.js'"],
} as const

async function resolveGroupAlias(group: (typeof groups)[number], path: string): Promise<string> {
  const base = join(root, `src/${group}`, path.slice(2))

  for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    if (await Bun.file(candidate).exists()) return candidate
  }

  throw new Error(`Could not resolve ${path} inside tc96/${group}.`)
}

await rm(join(root, 'dist'), { force: true, recursive: true })

for (const group of groups) {
  const entrypoints = [join(root, `src/${group}/index.ts`), join(root, `src/${group}/core.ts`)]

  if (group === 'view') {
    entrypoints.push(join(root, 'src/view/components/ui/button.tsx'), join(root, 'src/view/lib/utils.ts'))
  }

  if (group === 'properties') {
    entrypoints.push(join(root, 'src/properties/components/ui/input.tsx'))
  }

  const result = await Bun.build({
    entrypoints,
    format: 'esm',
    outdir: join(root, `dist/internal/${group}`),
    packages: 'external',
    plugins: [
      {
        name: 'resolve-group-alias',
        setup(build) {
          build.onResolve({ filter: /^@\// }, async ({ path }) => ({
            path: await resolveGroupAlias(group, path),
          }))
        },
      },
    ],
    target: 'browser',
  })

  if (!result.success) {
    throw new Error(`Could not build tc96/${group}.`)
  }
}

for (const [module, exports] of Object.entries(publicModules)) {
  const output = join(root, `dist/${module}`)
  await mkdir(output, { recursive: true })
  await writeFile(join(output, 'index.js'), `${exports.join('\n')}\n`)
}
