import { filterScraped } from './common/filter.js'
import { getRootName } from './common/root.js'
import { loadFigmaDocument, processFigma } from './sources/figma.js'
import { generatePlaywright } from './targets/playwright'
import { EstridiConfig, FigmaConfig, Scraped, ScrapedStart } from './scraped'
import { format } from 'prettier'
import fs from 'node:fs'
import { injectVirtualNodes } from './common/virtualNodes'
import { generateVitest } from './targets/vitest'

export * from './sources/tldraw.js'
export * from './scraped.js'
export * from './converter/tldrawConverter.js'
export { loadFigmaDocument, processFigma } from './sources/figma.js'
export { processTldraw } from './sources/tldraw.js'
export { filterScraped }

export type EstridiSourceConfig = {
  getDataFunc: (args: any) => Promise<any>
  processFunc: (data: any) => Promise<Scraped>
}

export type EstridiTargetConfig = {
  generatorFunc: (
    name: string,
    scraped: Scraped,
    options: EstridiGeneratorOptions,
  ) => Promise<string>
  getFileName: (name: string) => string
}

export type EstridiGeneratorOptions = {}

export type EstridiTargets = 'playwright' | 'vitest'
export type EstridiSources = 'figma'

function isFigmaConfig(config: EstridiConfig) {
  return (config as FigmaConfig)?.fileId && (config as FigmaConfig)?.token
}

export const getSource = (config: EstridiConfig) => {
  let sourceName: EstridiSources
  if (isFigmaConfig(config)) sourceName = 'figma'
  if (!sourceName) throw 'No source name'
  const sources: Record<EstridiSources, EstridiSourceConfig> = {
    figma: {
      processFunc: processFigma,
      getDataFunc: loadFigmaDocument,
    },
  }
  const source = sources[sourceName]
  if (!source) throw 'Invalid source'
  return source
}

export const loadScrapedFromSource = async (
  scraped: Scraped,
  rootName?: string,
) => {
  const foundRootName = getRootName(scraped, rootName)
  if (!foundRootName) {
    const roots = scraped.filter((node: ScrapedStart) => node.type === 'root')
    throw `Root could not be found, use one of the following root nodes:
${roots.map((r: ScrapedStart) => r.raw).join('\n')}`
  }
  const filtered = filterScraped(scraped, foundRootName)
  return { scraped: filtered, rootName: foundRootName }
}

export const loadScraped = async (config: EstridiConfig) => {
  const source = getSource(config)
  const data = await source.getDataFunc(config)
  return await source.processFunc(data)
}

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
  rootName?: string
  virtualNodes?: boolean
}): Promise<{ code: string; fileName: string }> => {
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
  const target = targets[args.target || 'playwright']
  const { scraped, rootName } = await loadScrapedFromSource(
    args.scraped,
    args.rootName,
  )
  const scrapedTemp = args.virtualNodes
    ? await injectVirtualNodes(scraped)
    : scraped
  const code = await target.generatorFunc(rootName, scrapedTemp, {})
  const prettierOptions = fs.existsSync('.prettierrc')
    ? JSON.parse(fs.readFileSync('.prettierrc', 'utf8'))
    : {}
  const formattedCode = await format(code, {
    parser: 'typescript',
    ...prettierOptions,
  }).catch(() => code)
  return { code: formattedCode, fileName: target.getFileName(rootName) }
}
