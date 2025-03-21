import { loadScraped } from './sources'
import { Scraped } from './scraped'
import { prepareTestableNodeTree } from './prepare'

export type FigmaConfig = {
  source: 'figma'
  token: string
  fileId: string
}

export type TlDrawConfig = {
  source: 'tldraw'
  file: string
}

export type GenerateTestFileConfig = FigmaConfig | TlDrawConfig

export type RootConfig = {
  name?: string
  target?: 'playwright' | 'vitest'
}

export const generateTestFile = async (
  scraped: Scraped,
  config: GenerateTestFileConfig,
) => {}

export const generateTestFiles = async (
  config: GenerateTestFileConfig,
  rootConfigs?: RootConfig[],
) => {
  const scraped = await loadScraped(config)
  const testableNodeTree = await prepareTestableNodeTree({
    scraped,
    rootConfigs,
  })
}
