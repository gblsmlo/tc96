import { expect, test } from 'bun:test'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const packageRoot = join(import.meta.dir, '..')
const workspaceRoot = join(packageRoot, '../..')

type PackageManifest = {
  name: string
  private?: boolean
  exports?: Record<string, unknown>
  workspaces?: string[]
}

async function readManifest(path: string): Promise<PackageManifest> {
  return JSON.parse(await Bun.file(path).text()) as PackageManifest
}

test('keeps one public package inside the workspace', async () => {
  const root = await readManifest(join(workspaceRoot, 'package.json'))
  const packagesDirectory = join(workspaceRoot, 'packages')
  const packageDirectories = await readdir(packagesDirectory, { withFileTypes: true })
  const manifests = await Promise.all(
    packageDirectories
      .filter((entry) => entry.isDirectory())
      .map((entry) => readManifest(join(packagesDirectory, entry.name, 'package.json'))),
  )

  expect(root.private).toBe(true)
  expect(root.workspaces).toEqual(['packages/*', 'apps/*'])
  expect(manifests.filter((manifest) => !manifest.private).map((manifest) => manifest.name)).toEqual([
    'tc96',
  ])
})

test('exposes layers as subpaths and keeps historical groups private', async () => {
  const manifest = await readManifest(join(packageRoot, 'package.json'))
  const exports = Object.keys(manifest.exports ?? {})

  expect(exports).toContain('./ui')
  expect(exports).toContain('./components')
  expect(exports).toContain('./blocks')
  expect(exports).toContain('./utils')
  expect(exports).not.toContain('.')
  expect(exports).not.toContain('./view')
  expect(exports).not.toContain('./datagrid')
})

test('keeps a generated COSS entry for every compatibility registry key', async () => {
  const groups = ['view', 'properties', 'datagrid', 'detail-sheet', 'editable', 'filter-builder']
  const generated = join(packageRoot, 'registry/generated')

  for (const group of groups) {
    expect(await Bun.file(join(generated, `${group}.json`)).exists()).toBe(true)
  }
})

test('organizes implementation by feature and keeps public layers as facades', async () => {
  const featureNames = [
    'collection-views',
    'properties',
    'data-grid',
    'detail-sheet',
    'editable',
    'filter-builder',
  ]
  const historicalDirectories = [
    'view',
    'properties',
    'datagrid',
    'detail-sheet',
    'editable',
    'filter-builder',
  ]

  for (const featureName of featureNames) {
    expect(
      await Bun.file(join(packageRoot, `src/features/${featureName}/index.ts`)).exists(),
    ).toBeTrue()
    expect(
      await Bun.file(join(packageRoot, `src/features/${featureName}/tsconfig.json`)).exists(),
    ).toBeTrue()
  }

  for (const historicalDirectory of historicalDirectories) {
    expect(
      await Bun.file(join(packageRoot, `src/${historicalDirectory}/index.ts`)).exists(),
    ).toBeFalse()
  }

  const ui = await Bun.file(join(packageRoot, 'src/ui/index.ts')).text()
  const components = await Bun.file(join(packageRoot, 'src/components/index.ts')).text()
  const blocks = await Bun.file(join(packageRoot, 'src/blocks/index.ts')).text()
  const utils = await Bun.file(join(packageRoot, 'src/utils/index.ts')).text()

  expect(ui).toBe("export * from '../shared/ui'\n")
  expect(utils).toBe("export * from '../shared/utils'\n")
  expect(components).toContain("export * from '../features/properties'")
  expect(components).toContain("export * from '../features/editable'")
  expect(blocks).toContain("export * from '../features/collection-views'")
  expect(blocks).toContain("export * from '../features/data-grid'")
  expect(blocks).toContain("export * from '../features/detail-sheet'")
  expect(blocks).toContain("export * from '../features/filter-builder'")
})

test('builds tc96/utils from shared source instead of a feature', async () => {
  const canonicalUtils = await Bun.file(join(packageRoot, 'src/shared/utils/index.ts')).text()
  const buildPackage = await Bun.file(join(packageRoot, 'scripts/build-package.ts')).text()
  const rewriteDeclarations = await Bun.file(
    join(packageRoot, 'scripts/rewrite-declarations.ts'),
  ).text()

  expect(canonicalUtils).toContain('export function cn')
  expect(buildPackage).toContain("join(root, 'src/shared/utils/index.ts')")
  expect(buildPackage).not.toContain("utils: [\"export { cn } from '../internal/view")
  expect(rewriteDeclarations).not.toContain("utils: [\"export { cn } from '../internal/view")
})

test('builds tc96/ui from shared primitives', async () => {
  const canonicalUi = await Bun.file(join(packageRoot, 'src/shared/ui/index.ts')).text()
  const canonicalButton = await Bun.file(join(packageRoot, 'src/shared/ui/button.tsx')).text()
  const buildPackage = await Bun.file(join(packageRoot, 'scripts/build-package.ts')).text()

  expect(canonicalUi).toContain("from './button'")
  expect(canonicalUi).toContain('buttonSizes')
  expect(canonicalUi).toContain('inputSizes')
  expect(canonicalButton).not.toContain("variant: 'default'")
  expect(canonicalButton).not.toMatch(/\n\s+default:\s*['"]/) 
  expect(canonicalUi).toContain("from './field'")
  expect(canonicalUi).toContain("from './form'")
  expect(canonicalUi).toContain("from './group'")
  expect(canonicalUi).toContain("from './input'")
  expect(canonicalUi).toContain("from './input-group'")
  expect(canonicalUi).toContain("from './kbd'")
  expect(canonicalUi).toContain("from './text'")
  expect(buildPackage).toContain("join(root, 'src/shared/ui/button.tsx')")
  expect(buildPackage).toContain('Button, buttonSizes, buttonVariants')
  expect(buildPackage).toContain("join(root, 'src/shared/ui/field.tsx')")
  expect(buildPackage).toContain("join(root, 'src/shared/ui/form.tsx')")
  expect(buildPackage).toContain("join(root, 'src/shared/ui/group.tsx')")
  expect(buildPackage).toContain("join(root, 'src/shared/ui/input-group.tsx')")
  expect(buildPackage).toContain("join(root, 'src/shared/ui/kbd.tsx')")
  expect(buildPackage).toContain("join(root, 'src/shared/ui/text.tsx')")
  expect(buildPackage).toContain("naming: '[name].[ext]'")
  expect(buildPackage).not.toContain("ui: [\"export { Button, buttonVariants } from '../internal/view")
})

test('keeps borders and focus outlines aligned with the COSS token contract', async () => {
  const themePaths = [
    'apps/storybook/src/styles.css',
    'packages/tc96/src/features/data-grid/styles/global.css',
    'packages/tc96/src/features/detail-sheet/styles/global.css',
    'packages/tc96/src/features/editable/styles/global.css',
    'packages/tc96/src/features/filter-builder/styles/global.css',
    'packages/tc96/src/features/properties/styles/global.css',
    'packages/tc96/src/features/collection-views/styles/global.css',
  ]

  for (const themePath of themePaths) {
    const source = await Bun.file(join(workspaceRoot, themePath)).text()

    expect(source).toContain('--border: --alpha(var(--color-black) / 8%);')
    expect(source).toContain('--input: --alpha(var(--color-black) / 10%);')
    expect(source).toContain('--ring: var(--color-neutral-400);')
    expect(source).toContain('--border: --alpha(var(--color-white) / 6%);')
    expect(source).toContain('--input: --alpha(var(--color-white) / 8%);')
    expect(source).toContain('--ring: var(--color-neutral-500);')
    expect(source).toContain('@apply border-border outline-ring/50;')
    expect(source).not.toMatch(/--(?:border|input|ring):[^;]*color-stone/)
  }

  const rawPaletteToken =
    /\b(?:border|outline|ring)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:\/\d+)?\b/
  const arbitraryColor = /\b(?:border|outline|ring)-\[(?:#|rgb|hsl|oklch|color-mix)/
  const sourceGlob = new Bun.Glob('**/*.{ts,tsx}')

  for (const sourceRoot of ['packages/tc96/src', 'apps/storybook/src']) {
    for await (const sourcePath of sourceGlob.scan({ cwd: join(workspaceRoot, sourceRoot) })) {
      const source = await Bun.file(join(workspaceRoot, sourceRoot, sourcePath)).text()

      expect(source).not.toMatch(rawPaletteToken)
      expect(source).not.toMatch(arbitraryColor)
    }
  }
})

test('generates Storybook API docs while keeping Fumadocs as the conceptual authority', async () => {
  const storybookRoot = join(workspaceRoot, 'apps/storybook')
  const manifest = await readManifest(join(storybookRoot, 'package.json'))
  const main = await Bun.file(join(storybookRoot, '.storybook/main.ts')).text()
  const preview = await Bun.file(join(storybookRoot, '.storybook/preview.ts')).text()
  const allowedImports = new Set(['tc96/ui', 'tc96/components', 'tc96/blocks'])
  const allowedStoryLayers = new Set(['ui', 'components', 'blocks'])
  const sourceGlob = new Bun.Glob('**/*.{ts,tsx}')
  const storyGlob = new Bun.Glob('**/*.stories.{ts,tsx}')
  const mdxGlob = new Bun.Glob('**/*.mdx')

  expect(manifest.private).toBe(true)
  expect(manifest).toHaveProperty('devDependencies.@storybook/addon-docs')
  expect(main).toContain('@storybook/addon-docs')
  expect(main).not.toContain('.mdx')
  expect(main).toContain('autodocs: true')
  expect(main).toContain("defaultName: 'Doc'")
  expect(preview).toContain("tags: ['autodocs', 'test']")
  expect(preview).toContain("theme: 'light'")
  expect(preview).toContain("value: 'dark'")
  expect(preview).toContain("root.classList.toggle('dark'")

  for await (const mdxPath of mdxGlob.scan({ cwd: storybookRoot })) {
    throw new Error(`Storybook must not contain documentation pages: ${mdxPath}`)
  }

  for await (const storyPath of storyGlob.scan({ cwd: join(storybookRoot, 'src') })) {
    expect(allowedStoryLayers.has(storyPath.split('/')[0])).toBe(true)
  }

  for await (const sourcePath of sourceGlob.scan({ cwd: join(storybookRoot, 'src') })) {
    const source = await Bun.file(join(storybookRoot, 'src', sourcePath)).text()
    const tc96Imports = source.matchAll(/from ["'](tc96(?:\/[^"']*)?)["']/g)

    expect(source).not.toContain('packages/tc96/src')
    expect(source).not.toContain('tc96/utils')
    expect(source).not.toMatch(/export const Docs\b/)
    expect(source).not.toMatch(/title:\s*["']Utils(?:\/|["'])/)

    for (const match of tc96Imports) {
      expect(allowedImports.has(match[1])).toBe(true)
    }
  }

  const docsMeta = await Bun.file(join(workspaceRoot, 'apps/docs/content/docs/meta.json')).text()
  expect(docsMeta).toContain('"utils"')
  expect(await Bun.file(join(workspaceRoot, 'apps/docs/content/docs/utils.mdx')).exists()).toBe(true)
})
