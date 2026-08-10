import { join } from 'node:path'

const root = join(import.meta.dir, '..')

async function runTests(cwd: string, paths: string[]) {
  const child = Bun.spawn([process.execPath, 'test', '--isolate', ...paths], {
    cwd,
    env: Bun.env,
    stderr: 'inherit',
    stdout: 'inherit',
  })
  const exitCode = await child.exited

  if (exitCode !== 0) throw new Error(`Test suite failed in ${cwd}.`)
}

await runTests(root, [
  'tests',
  'src/view',
  'src/datagrid',
  'src/detail-sheet',
  'src/editable',
  'src/filter-builder',
  'src/utils',
  'src/ui',
])
await runTests(join(root, 'src/properties'), ['.'])
