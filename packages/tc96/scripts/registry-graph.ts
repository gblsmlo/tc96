import { readFile, stat } from 'node:fs/promises'
import { dirname, extname, join, posix, relative, resolve, sep } from 'node:path'
import ts from 'typescript'

export interface RegistrySourceFile {
  path: string
  target: string
  type: string
  [key: string]: unknown
}

export interface GeneratedRegistryFile extends RegistrySourceFile {
  content: string
}

interface ModuleSpecifier {
  end: number
  specifier: string
  start: number
}

interface RegistryGraphOptions {
  files: RegistrySourceFile[]
  packageRoot: string
  registryDependencies?: string[]
  sourceRoot: string
}

interface GraphFile extends RegistrySourceFile {
  absolutePath: string
  content: string
  dependencies: Map<string, string>
}

const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.css'] as const

export function parseModuleSpecifiers(content: string, fileName = 'registry-file.tsx') {
  const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true)
  const specifiers: ModuleSpecifier[] = []

  const visit = (node: ts.Node) => {
    let moduleSpecifier: ts.Expression | undefined

    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      moduleSpecifier = node.moduleSpecifier
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1
    ) {
      moduleSpecifier = node.arguments[0]
    }

    if (moduleSpecifier && ts.isStringLiteralLike(moduleSpecifier)) {
      specifiers.push({
        end: moduleSpecifier.getEnd() - 1,
        specifier: moduleSpecifier.text,
        start: moduleSpecifier.getStart(sourceFile) + 1,
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return specifiers
}

function toPosix(path: string) {
  return path.split(sep).join(posix.sep)
}

function withoutSourceExtension(path: string) {
  return path.replace(/\.(?:[cm]?[jt]sx?)$/, '')
}

function relativeModuleSpecifier(fromTarget: string, toTarget: string) {
  const fromRoot = fromTarget.split('/')[0]
  const toRoot = toTarget.split('/')[0]

  if (fromRoot !== toRoot) {
    throw new Error(
      `Registry dependency crosses target aliases (${fromTarget} -> ${toTarget}). ` +
        'Use targets under the same install root or an explicit external dependency.',
    )
  }

  const relativeTarget = withoutSourceExtension(posix.relative(posix.dirname(fromTarget), toTarget))
  return relativeTarget.startsWith('.') ? relativeTarget : `./${relativeTarget}`
}

async function resolveSourcePath(candidate: string) {
  const candidates = extname(candidate)
    ? [candidate]
    : [
        candidate,
        ...sourceExtensions.map((extension) => `${candidate}${extension}`),
        ...sourceExtensions.map((extension) => join(candidate, `index${extension}`)),
      ]

  for (const path of candidates) {
    try {
      if ((await stat(path)).isFile()) return path
    } catch {
      // Try the next supported source extension.
    }
  }

  return undefined
}

function inferredRegistryType(path: string) {
  if (path.endsWith('.css')) return 'registry:style'
  if (path.includes('/hooks/')) return 'registry:hook'
  if (path.includes('/lib/') || path.endsWith('/types.ts')) return 'registry:lib'
  return 'registry:component'
}

function cossDependencyForUiImport(specifier: string) {
  const primitive = specifier.slice('@/components/ui/'.length).split('/')[0]
  return primitive ? `@coss/${primitive}` : undefined
}

function findAliasTarget(graph: Map<string, GraphFile>, specifier: string) {
  const aliasPath = withoutSourceExtension(specifier.slice(2))
  const matches = [...graph.values()].filter((file) =>
    withoutSourceExtension(file.target).endsWith(`/${aliasPath}`),
  )

  if (matches.length > 1) {
    throw new Error(
      `Alias import ${specifier} matches multiple registry targets: ${matches.map((file) => file.target).join(', ')}`,
    )
  }

  return matches[0]
}

export async function buildRegistryGraph({
  files,
  packageRoot,
  registryDependencies = [],
  sourceRoot,
}: RegistryGraphOptions): Promise<GeneratedRegistryFile[]> {
  const absolutePackageRoot = resolve(packageRoot)
  const absoluteSourceRoot = resolve(packageRoot, sourceRoot)
  const dependencySet = new Set(registryDependencies)
  const graph = new Map<string, GraphFile>()
  const queue: GraphFile[] = []

  const addFile = async (file: RegistrySourceFile) => {
    const absolutePath = resolve(packageRoot, file.path)
    const relativePath = toPosix(relative(absolutePackageRoot, absolutePath))

    if (relativePath.startsWith('..') || relativePath === '') {
      throw new Error(`Registry source escapes the package root: ${file.path}`)
    }

    const existing = graph.get(absolutePath)
    if (existing) {
      if (existing.target !== file.target) {
        throw new Error(
          `Registry source ${relativePath} has conflicting targets: ${existing.target} and ${file.target}`,
        )
      }
      return existing
    }

    const content = await readFile(absolutePath, 'utf8')
    const graphFile: GraphFile = {
      ...file,
      absolutePath,
      content,
      dependencies: new Map(),
      path: relativePath,
    }
    graph.set(absolutePath, graphFile)
    queue.push(graphFile)
    return graphFile
  }

  for (const file of files) await addFile(file)

  for (let index = 0; index < queue.length; index += 1) {
    const importer = queue[index]
    if (!importer) continue

    for (const { specifier } of parseModuleSpecifiers(importer.content, importer.path)) {
      let candidate: string | undefined

      if (specifier.startsWith('.')) {
        candidate = resolve(dirname(importer.absolutePath), specifier)
      } else if (specifier.startsWith('@/components/ui/')) {
        const dependency = cossDependencyForUiImport(specifier)
        if (dependency && !dependencySet.has(dependency)) {
          throw new Error(
            `${importer.path} imports ${specifier}, but ${dependency} is missing from registryDependencies.`,
          )
        }
        continue
      } else if (specifier.startsWith('@/')) {
        candidate = resolve(absoluteSourceRoot, specifier.slice(2))
      } else {
        continue
      }

      const aliasTarget = specifier.startsWith('@/') ? findAliasTarget(graph, specifier) : undefined
      const dependencyPath = aliasTarget?.absolutePath ?? (await resolveSourcePath(candidate))
      if (!dependencyPath) {
        throw new Error(`Cannot resolve local registry import ${specifier} from ${importer.path}.`)
      }

      const existing = aliasTarget ?? graph.get(dependencyPath)
      const sourceRelative = toPosix(relative(dirname(importer.absolutePath), dependencyPath))
      const target = existing?.target ?? posix.normalize(posix.join(posix.dirname(importer.target), sourceRelative))
      const dependency =
        existing ??
        (await addFile({
          path: toPosix(relative(absolutePackageRoot, dependencyPath)),
          target,
          type: inferredRegistryType(dependencyPath),
        }))

      importer.dependencies.set(specifier, dependency.absolutePath)
    }
  }

  return queue.map(({ absolutePath: _absolutePath, content, dependencies, ...file }) => {
    const replacements = parseModuleSpecifiers(content, file.path)
      .filter(({ specifier }) => dependencies.has(specifier))
      .map(({ start, end, specifier }) => {
        const dependencyPath = dependencies.get(specifier)
        const dependency = dependencyPath ? graph.get(dependencyPath) : undefined
        if (!dependency) throw new Error(`Missing dependency graph node for ${specifier} in ${file.path}.`)

        return {
          end,
          start,
          value: relativeModuleSpecifier(file.target, dependency.target),
        }
      })
      .toSorted((left, right) => right.start - left.start)

    let rewrittenContent = content
    for (const replacement of replacements) {
      rewrittenContent =
        rewrittenContent.slice(0, replacement.start) +
        replacement.value +
        rewrittenContent.slice(replacement.end)
    }

    return { ...file, content: rewrittenContent }
  })
}
