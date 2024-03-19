import { writeAllFiles } from './utils/files'
import { Scraped } from '../common'
import { generatePlaywrightTests } from './playwright'
import { generateScrapedTs } from './scrapedTs'

export type GenerationResult = { file: string, content: string, overwrite: boolean }

export const getFileName = (name: string) =>
  name
    .replace(/ /g, '_')
    .replace(/[:|\/"]/g, '')
    .toLowerCase()


export const generateAll = (scraped: Scraped) => {
  const scrapedTs: GenerationResult = generateScrapedTs(scraped, 'output')
  const playwright = generatePlaywrightTests(scraped, 'output')
  writeAllFiles([scrapedTs, playwright])
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
