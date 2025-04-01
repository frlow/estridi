import { loadFigmaDocument, processFigma } from './sources/figma.js'
import { generatePlaywright } from './targets/playwright'
import { Scraped, ScrapedStart } from './scraped'
import { format } from 'prettier'
import fs from 'node:fs'
import { generateVitest } from './targets/vitest'
import { getTestableNodeTree2, NodeTree } from './targets/testableNodeTree2'

export * from './sources/tldraw.js'
export * from './scraped.js'
export * from './converter/tldrawConverter.js'
export * from './converter/figmaConverter.js'
export { loadFigmaDocument, processFigma } from './sources/figma.js'
export { processTldraw } from './sources/tldraw.js'

export type EstridiSourceConfig = {
  getDataFunc: (args: any) => Promise<any>
  processFunc: (data: any) => Promise<Scraped>
}

export type EstridiTargetConfig = {
  generatorFunc: (nodeTree: NodeTree) => Promise<string>
  getFileName: (name: string) => string
}

export type EstridiGeneratorOptions = {}

export type EstridiTargets = 'playwright' | 'vitest'

export const parseRoots = (
  scraped: Scraped,
  rootName: string | undefined,
): ScrapedStart[] => {
  const allRoots = scraped.filter(
    (n: ScrapedStart) => n.type === 'root',
  ) as ScrapedStart[]
  if (rootName === '+') return allRoots
  return allRoots.filter((r) => rootName.split(',').includes(r.text))
}

export const generateEstridiTests = async (args: {
  scraped: Scraped
  target?: string
  rootName: string
  virtualNodes?: boolean
}): Promise<{ code: string; fileName: string }> => {
  if (!args.target || args.target === 'none') return undefined
  const targets: Record<EstridiTargets, EstridiTargetConfig> = {
    playwright: {
      getFileName: (name) => `${name}.spec.ts`,
      generatorFunc: generatePlaywright,
    },
    vitest: {
      getFileName: (name) => `${name}.test.ts`,
      generatorFunc: generateVitest,
    },
  }
  const target = targets[args.target]
  // let scraped = args.virtualNodes
  //   ? await injectVirtualNodes(args.scraped)
  //   : args.scraped
  // scraped = await injectUnifiedTables(scraped)
  const nodeTree = getTestableNodeTree2(args.scraped, args.rootName)
  const code = await target.generatorFunc(nodeTree)
  const prettierOptions = fs.existsSync('.prettierrc')
    ? JSON.parse(fs.readFileSync('.prettierrc', 'utf8'))
    : {}
  const formattedCode = await format(code, {
    parser: 'typescript',
    ...prettierOptions,
  }).catch(() => code)
  return { code: formattedCode, fileName: target.getFileName(args.rootName) }
}
