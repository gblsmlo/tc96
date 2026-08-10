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

test('keeps a generated COSS entry for every historical source group', async () => {
  const groups = ['view', 'properties', 'datagrid', 'detail-sheet', 'editable', 'filter-builder']
  const generated = join(packageRoot, 'registry/generated')

  for (const group of groups) {
    expect(await Bun.file(join(generated, `${group}.json`)).exists()).toBe(true)
  }
})

test('builds tc96/utils from the canonical source instead of a historical group', async () => {
  const canonicalUtils = await Bun.file(join(packageRoot, 'src/utils/index.ts')).text()
  const buildPackage = await Bun.file(join(packageRoot, 'scripts/build-package.ts')).text()
  const rewriteDeclarations = await Bun.file(
    join(packageRoot, 'scripts/rewrite-declarations.ts'),
  ).text()

  expect(canonicalUtils).toContain('export function cn')
  expect(buildPackage).toContain("join(root, 'src/utils/index.ts')")
  expect(buildPackage).not.toContain("utils: [\"export { cn } from '../internal/view")
  expect(rewriteDeclarations).not.toContain("utils: [\"export { cn } from '../internal/view")
})

test('builds tc96/ui from canonical primitives', async () => {
  const canonicalUi = await Bun.file(join(packageRoot, 'src/ui/index.ts')).text()
  const buildPackage = await Bun.file(join(packageRoot, 'scripts/build-package.ts')).text()

  expect(canonicalUi).toContain("from './button'")
  expect(canonicalUi).toContain("from './input'")
  expect(buildPackage).toContain("join(root, 'src/ui/button.tsx')")
  expect(buildPackage).not.toContain("ui: [\"export { Button, buttonVariants } from '../internal/view")
})

test('keeps Storybook as a consumer of public tc96 subpaths', async () => {
  const storybookRoot = join(workspaceRoot, 'apps/storybook')
  const manifest = await readManifest(join(storybookRoot, 'package.json'))
  const allowedImports = new Set(['tc96/ui', 'tc96/components', 'tc96/blocks', 'tc96/utils'])
  const sourceGlob = new Bun.Glob('**/*.{ts,tsx}')

  expect(manifest.private).toBe(true)

  for await (const sourcePath of sourceGlob.scan({ cwd: join(storybookRoot, 'src') })) {
    const source = await Bun.file(join(storybookRoot, 'src', sourcePath)).text()
    const tc96Imports = source.matchAll(/from ["'](tc96(?:\/[^"']*)?)["']/g)

    expect(source).not.toContain('packages/tc96/src')

    for (const match of tc96Imports) {
      expect(allowedImports.has(match[1])).toBe(true)
    }
  }
})
