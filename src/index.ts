import { filterScraped } from './common/filter.js'
import { getRootName } from './common/root.js'
import { generatePlaywright } from './targets/playwright.js'
import { loadFigmaDocument, processFigma } from './sources/figma.js'
import { loadDrawIoDocument, processDrawIo } from './sources/drawio.js'

export type EstridiSourceConfig = {
  getDataFunc: (args: any) => Promise<any>
  processFunc: (data: any) => Promise<Scraped>
}

export type EstridiTargetConfig = {
  generatorFunc: (name: string, scraped: Scraped) => Promise<string>
  getFileName: (name: string) => string
}

export type EstridiTargets = 'playwright'
export type EstridiSources = 'figma' | 'drawio'

function isFigmaConfig(config: EstridiConfig) {
  return (config as FigmaConfig)?.fileId && (config as FigmaConfig)?.token
}

function isFileConfig(config: EstridiConfig) {
  return (config as FileConfig)?.file
}

export const getSource = (config: EstridiConfig) => {
  let sourceName: EstridiSources
  if (isFigmaConfig(config)) sourceName = 'figma'
  if (isFileConfig(config)?.endsWith('.drawio')) sourceName = 'drawio'
  if (!sourceName) throw 'No source name'
  const sources: Record<EstridiSources, EstridiSourceConfig> = {
    figma: {
      processFunc: processFigma,
      getDataFunc: loadFigmaDocument
    },
    drawio: {
      processFunc: processDrawIo,
      getDataFunc: loadDrawIoDocument
    }
  }
  const source = sources[sourceName]
  if (!source) throw 'Invalid source'
  return source
}

export const loadScrapedFromSource = async (config: EstridiConfig, rootName?: string) => {
  const source = getSource(config)
  const data = await source.getDataFunc(config)
  const scraped = await source.processFunc(data)
  const foundRootName = getRootName(scraped, rootName)
  if (!foundRootName) {
    const roots = scraped
      .filter((node: ScrapedStart) => node.isRoot)
    throw `Root could not be found, use one of the following root nodes:
${roots.map(r => r.raw).join('\n')}`
  }
  const filtered = filterScraped(scraped, foundRootName)
  return { scraped: filtered, rootName: foundRootName }
}

export const generateEstridiTests = async (args: {
  config: EstridiConfig,
  target?: 'playwright',
  rootName?: string
}) => {
  const targets: Record<EstridiTargets, EstridiTargetConfig> = {
    playwright: {
      getFileName: (name) => `${name}.spec.ts`,
      generatorFunc: generatePlaywright
    }
  }
  const target = targets[args.target || 'playwright']
  const { scraped, rootName } = await loadScrapedFromSource(args.config, args.rootName)
  const code = await target.generatorFunc(rootName, scraped)
  return { code, fileName: target.getFileName(rootName) }
}
