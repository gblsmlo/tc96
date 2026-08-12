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
  'src/features/collection-views',
  'src/features/data-grid',
  'src/features/detail-sheet',
  'src/features/editable',
  'src/features/filter-builder',
  'src/shared/utils',
  'src/shared/ui',
])
await runTests(join(root, 'src/features/properties'), ['.'])
