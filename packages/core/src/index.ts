import { filterScraped } from './common/filter.js'
import { getRootName } from './common/root.js'
import { loadFigmaDocument, processFigma } from './sources/figma.js'
import { generatePlaywright } from './targets/playwright'
import { EstridiConfig, FigmaConfig, Scraped, ScrapedStart } from './scraped'

export * from './sources/tldraw.js'
export * from './scraped.js'
export * from './converter/tldrawConverter.js'
export { loadFigmaDocument, processFigma } from './sources/figma.js'
export { filterScraped }

export type EstridiSourceConfig = {
  getDataFunc: (args: any) => Promise<any>
  processFunc: (data: any) => Promise<Scraped>
}

export type EstridiTargetConfig = {
  generatorFunc: (name: string, scraped: Scraped) => Promise<string>
  getFileName: (name: string) => string
}

export type EstridiTargets = 'playwright'
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
      getDataFunc: loadFigmaDocument
    }
  }
  const source = sources[sourceName]
  if (!source) throw 'Invalid source'
  return source
}

export const loadScrapedFromSource = async (scraped: Scraped, rootName?: string) => {
  const foundRootName = getRootName(scraped, rootName)
  if (!foundRootName) {
    const roots = scraped
      .filter((node: ScrapedStart) => node.type === 'root')
    throw `Root could not be found, use one of the following root nodes:
${roots.map(r => r.raw).join('\n')}`
  }
  const filtered = filterScraped(scraped, foundRootName)
  return { scraped: filtered, rootName: foundRootName }
}

export const loadScraped = async (config: EstridiConfig) => {
  const source = getSource(config)
  const data = await source.getDataFunc(config)
  return await source.processFunc(data)
}

export const parseRootNames = (scraped: Scraped, rootName: string | undefined): string[] => {
  if (rootName !== '+') return rootName?.split(',') || [undefined]
  return scraped.filter((n: ScrapedStart) => n.type === 'root').map(n => n.raw)
}

export const generateEstridiTests = async (args: {
  scraped: Scraped,
  target?: 'playwright',
  rootName?: string,
}): Promise<{ code: string, fileName: string }[]> => {
  const targets: Record<EstridiTargets, EstridiTargetConfig> = {
    playwright: {
      getFileName: (name) => `${name}.spec.ts`,
      generatorFunc: generatePlaywright
    }
  }
  const target = targets[args.target || 'playwright']
  const { scraped, rootName } = await loadScrapedFromSource(args.scraped, args.rootName)
  const code = await target.generatorFunc(rootName, scraped)
  return [{ code, fileName: target.getFileName(rootName) }]
}
