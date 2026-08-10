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
