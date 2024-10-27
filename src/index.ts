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
export const generateEstridiTests = async (args: { config: any, target?: 'playwright', rootName?: string }) => {
  let sourceName: EstridiSources
  if (args?.config?.fileId && args?.config?.token) sourceName = 'figma'
  if (args?.config?.file?.endsWith('.drawio')) sourceName = 'drawio'

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

  const targets: Record<EstridiTargets, EstridiTargetConfig> = {
    playwright: {
      getFileName: (name) => `${name}.spec.ts`,
      generatorFunc: generatePlaywright
    }
  }
  const target = targets[args.target || 'playwright']
  const data = await source.getDataFunc(args.config)
  const scraped = await source.processFunc(data)
  const rootName = getRootName(scraped, args.rootName)
  if (!rootName) throw 'Root could not be found'
  const filtered = filterScraped(scraped, rootName)
  const code = await target.generatorFunc(rootName, filtered)
  return { code, fileName: target.getFileName(rootName) }
}
