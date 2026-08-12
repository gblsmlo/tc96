import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const features = {
  'collection-views': 'features/collection-views',
  properties: 'features/properties',
  'data-grid': 'features/data-grid',
  'detail-sheet': 'features/detail-sheet',
  editable: 'features/editable',
  'filter-builder': 'features/filter-builder',
} as const
const root = import.meta.dir + '/..'

const publicModules = {
  ui: [
    "export { Button, buttonSizes, buttonVariants } from './button.js'",
    "export { Field, FieldControl, FieldDescription, FieldError, FieldItem, FieldLabel, FieldPrimitive, FieldValidity } from './field.js'",
    "export { Form, FormPrimitive } from './form.js'",
    "export { Group, GroupSeparator, GroupText, groupVariants } from './group.js'",
    "export { Input, InputPrimitive, inputSizes, inputVariants } from './input.js'",
    "export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './input-group.js'",
    "export { Kbd, KbdGroup } from './kbd.js'",
    "export { Separator, SeparatorPrimitive } from './separator.js'",
    "export { Spinner } from './spinner.js'",
    "export { Text, textSizes, textVariants } from './text.js'",
  ],
  components: [
    "export * from '../internal/properties/index.js'",
    "export * from '../internal/editable/index.js'",
  ],
  blocks: [
    "export { KanbanView as Kanban } from '../internal/collection-views/index.js'",
    "export * from '../internal/collection-views/index.js'",
    "export * from '../internal/data-grid/index.js'",
    "export * from '../internal/detail-sheet/index.js'",
    "export * from '../internal/filter-builder/index.js'",
  ],
} as const

async function resolveFeatureAlias(sourceDirectory: string, path: string): Promise<string> {
  const base = join(root, 'src', sourceDirectory, path.slice(2))

  for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    if (await Bun.file(candidate).exists()) return candidate
  }

  throw new Error(`Could not resolve ${path} inside ${sourceDirectory}.`)
}

await rm(join(root, 'dist'), { force: true, recursive: true })

for (const [feature, sourceDirectory] of Object.entries(features)) {
  const entrypoints = [
    join(root, 'src', sourceDirectory, 'index.ts'),
    join(root, 'src', sourceDirectory, 'core.ts'),
  ]

  if (feature === 'collection-views') {
    entrypoints.push(
      join(root, 'src/features/collection-views/components/ui/button.tsx'),
      join(root, 'src/features/collection-views/lib/utils.ts'),
    )
  }

  if (feature === 'properties') {
    entrypoints.push(join(root, 'src/features/properties/components/ui/input.tsx'))
  }

  const result = await Bun.build({
    entrypoints,
    format: 'esm',
    outdir: join(root, `dist/internal/${feature}`),
    packages: 'external',
    plugins: [
      {
        name: 'resolve-feature-alias',
        setup(build) {
          build.onResolve({ filter: /^@\// }, async ({ path }) => ({
            path: await resolveFeatureAlias(sourceDirectory, path),
          }))
        },
      },
    ],
    target: 'browser',
  })

  if (!result.success) {
    throw new Error(`Could not build feature ${feature}.`)
  }
}

const uiResult = await Bun.build({
  entrypoints: [
    join(root, 'src/shared/ui/button.tsx'),
    join(root, 'src/shared/ui/field.tsx'),
    join(root, 'src/shared/ui/form.tsx'),
    join(root, 'src/shared/ui/group.tsx'),
    join(root, 'src/shared/ui/input.tsx'),
    join(root, 'src/shared/ui/input-group.tsx'),
    join(root, 'src/shared/ui/kbd.tsx'),
    join(root, 'src/shared/ui/separator.tsx'),
    join(root, 'src/shared/ui/spinner.tsx'),
    join(root, 'src/shared/ui/text.tsx'),
  ],
  format: 'esm',
  naming: '[name].[ext]',
  outdir: join(root, 'dist/ui'),
  packages: 'external',
  target: 'browser',
})

if (!uiResult.success) throw new Error('Could not build tc96/ui.')

const utilsResult = await Bun.build({
  entrypoints: [join(root, 'src/shared/utils/index.ts')],
  format: 'esm',
  outdir: join(root, 'dist/utils'),
  packages: 'external',
  target: 'browser',
})

if (!utilsResult.success) throw new Error('Could not build tc96/utils.')

for (const [module, exports] of Object.entries(publicModules)) {
  const output = join(root, `dist/${module}`)
  await mkdir(output, { recursive: true })
  await writeFile(join(output, 'index.js'), `${exports.join('\n')}\n`)
}
