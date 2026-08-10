import { rm } from 'node:fs/promises'
import { join } from 'node:path'

const groups = ['view', 'properties', 'datagrid', 'detail-sheet', 'editable', 'filter-builder'] as const
const root = import.meta.dir + '/..'

async function resolveGroupAlias(group: (typeof groups)[number], path: string): Promise<string> {
  const base = join(root, `src/${group}`, path.slice(2))

  for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    if (await Bun.file(candidate).exists()) return candidate
  }

  throw new Error(`Could not resolve ${path} inside tc96/${group}.`)
}

await rm(join(root, 'dist'), { force: true, recursive: true })

for (const group of groups) {
  const result = await Bun.build({
    entrypoints: [join(root, `src/${group}/index.ts`), join(root, `src/${group}/core.ts`)],
    format: 'esm',
    outdir: join(root, `dist/${group}`),
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
