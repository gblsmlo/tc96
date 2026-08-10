import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

const dist = join(import.meta.dir, '../dist')

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

for (const group of await readdir(dist)) {
  await rewrite(join(dist, group), join(dist, group))
}
