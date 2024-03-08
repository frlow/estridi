import { generateJSON } from './json'
import { writeAllFiles } from './files'
import { Scraped } from '../common'
import { generateVitest } from './vitest'
import { generatePlaywright } from './playwright'
import type { Config } from '../server'
import { getFeatures } from './utils/feature'

export type GenerationResult = { file: string, content: string, overwrite: boolean }

export const getFileName = (name: string) =>
  name
    .replace(/ /g, '_')
    .replace(/[:|\/"]/g, '')
    .toLowerCase()


export const generateAll = (scraped: Scraped, config: Config) => {
  const features = getFeatures(scraped)
  if (config.json) generateJSON(config.json, scraped, features)
  const filesToWrite: GenerationResult[] = []
  if (config.vitest) filesToWrite.push(...generateVitest(config.vitest, features))
  if (config.playwright) filesToWrite.push(...generatePlaywright(config.playwright, features))
  writeAllFiles(filesToWrite)
}

export const getPrettyLabel = (type: string) => {
  switch (type) {
    case 'message':
      return 'Message'
    case 'serviceCall':
      return 'ServiceCall'
    case 'script':
      return 'Script'
    case 'subprocess':
      return 'Subprocess'
    case 'signalListen':
      return 'Action'
    case 'signalSend':
      return 'SignalSend'
    default:
      return undefined
  }
}
