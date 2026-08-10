import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const groups = ['view', 'properties', 'datagrid', 'detail-sheet', 'editable', 'filter-builder']
const packageRoot = join(import.meta.dir, '..')
const temporaryRoot = await mkdtemp(join(tmpdir(), 'tc96-consumer-'))
const consumerRoot = join(temporaryRoot, 'consumer')

async function run(command: string[], cwd: string, capture = false) {
  const child = Bun.spawn(command, {
    cwd,
    env: { ...Bun.env, CI: 'true' },
    stderr: 'inherit',
    stdout: capture ? 'pipe' : 'inherit',
  })
  const stdout = capture ? await new Response(child.stdout).text() : ''
  const exitCode = await child.exited

  if (exitCode !== 0) throw new Error(`Command failed (${exitCode}): ${command.join(' ')}`)
  return stdout
}

async function createConsumer(tarball: string) {
  await mkdir(join(consumerRoot, 'src'), { recursive: true })
  await Bun.write(
    join(consumerRoot, 'package.json'),
    JSON.stringify(
      {
        name: 'tc96-consumer-contract',
        private: true,
        type: 'module',
        scripts: { build: 'tsc -b && vite build' },
        dependencies: {
          react: '19.1.1',
          'react-dom': '19.1.1',
          tc96: `file:${tarball}`,
        },
        devDependencies: {
          '@tailwindcss/vite': '4.2.2',
          '@types/node': '24.3.0',
          '@types/react': '19.1.11',
          '@types/react-dom': '19.1.7',
          '@vitejs/plugin-react': 'latest',
          tailwindcss: '4.2.2',
          typescript: '6.0.3',
          vite: 'latest',
        },
      },
      null,
      2,
    ) + '\n',
  )
  await Bun.write(
    join(consumerRoot, 'components.json'),
    JSON.stringify(
      {
        $schema: 'https://ui.shadcn.com/schema.json',
        style: 'new-york',
        rsc: false,
        tsx: true,
        tailwind: {
          config: '',
          css: 'src/index.css',
          baseColor: 'neutral',
          cssVariables: true,
        },
        iconLibrary: 'lucide',
        aliases: {
          components: '@/components',
          hooks: '@/hooks',
          lib: '@/lib',
          patterns: '@/components/patterns',
          ui: '@/components/ui',
          utils: '@/lib/utils',
        },
      },
      null,
      2,
    ) + '\n',
  )
  await Bun.write(
    join(consumerRoot, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          jsx: 'react-jsx',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          noEmit: true,
          paths: { '@/*': ['./src/*'] },
          skipLibCheck: true,
          strict: true,
          target: 'ES2022',
          types: ['node', 'vite/client'],
        },
        include: ['src', 'vite.config.ts'],
      },
      null,
      2,
    ) + '\n',
  )
  await Bun.write(
    join(consumerRoot, 'vite.config.ts'),
    `import { fileURLToPath, URL } from 'node:url'\nimport tailwindcss from '@tailwindcss/vite'\nimport react from '@vitejs/plugin-react'\nimport { defineConfig } from 'vite'\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },\n})\n`,
  )
  await Bun.write(
    join(consumerRoot, 'index.html'),
    '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n',
  )
  await Bun.write(join(consumerRoot, 'src/index.css'), '@import "tailwindcss";\n')
  await Bun.write(
    join(consumerRoot, 'src/status-pill.tsx'),
    await Bun.file(join(packageRoot, 'examples/utils/status-pill.tsx')).text(),
  )
  await Bun.write(
    join(consumerRoot, 'src/main.tsx'),
    `import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport { Button, Input } from 'tc96/ui'\nimport { StatusPill } from './status-pill'\nimport './index.css'\n\ncreateRoot(document.getElementById('root')!).render(<StrictMode><main><StatusPill>TC96 consumer</StatusPill><Input aria-label="Name" /><Button size="sm">Save</Button></main></StrictMode>)\n`,
  )
}

try {
  const packOutput = await run(
    [
      'npm',
      'pack',
      '--json',
      '--pack-destination',
      temporaryRoot,
      '--cache',
      '/private/tmp/tc96-npm-cache',
    ],
    packageRoot,
    true,
  )
  const packResult = JSON.parse(packOutput) as Array<{ filename: string }>
  const filename = packResult[0]?.filename
  if (!filename) throw new Error('npm pack did not return a tarball filename.')

  await createConsumer(join(temporaryRoot, filename))
  await run([process.execPath, 'install'], consumerRoot)

  for (const group of groups) {
    const registryItem = join(consumerRoot, `node_modules/tc96/registry/generated/${group}.json`)
    await run(
      [process.execPath, 'x', 'shadcn@latest', 'add', registryItem, '--yes', '--overwrite'],
      consumerRoot,
    )
  }

  const installedSources = await readFile(join(consumerRoot, 'src/main.tsx'), 'utf8')
  if (!installedSources.includes('TC96 consumer')) throw new Error('Consumer fixture was corrupted.')

  await run([process.execPath, 'run', 'build'], consumerRoot)
  console.log(`TC96 COSS consumer contract passed for ${groups.length} registry items.`)
} finally {
  await rm(temporaryRoot, { force: true, recursive: true })
}
