import { loadScraped } from './sources'

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

export const generateTestFile = async (config: GenerateTestFileConfig) => {
  const scraped = await loadScraped(config)
}
