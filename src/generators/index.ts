import { writeAllFiles } from '../utils/files.js'
import { GenerationResult, Scraped } from '../common.js'
import { generatePlaywrightTests } from './playwright.js'
import { generateScrapedTs } from './scrapedTs.js'
import path from 'node:path'



export const getFileName = (name: string) =>
  name
    .replace(/ /g, '_')
    .replace(/[:|\/"]/g, '')
    .toLowerCase()


export const generateAll = (scraped: Scraped) => {
  const targetDir = "tests"
  const scrapedTs: GenerationResult = generateScrapedTs(scraped, targetDir)
  const playwright = generatePlaywrightTests(scraped, targetDir)
  const json: GenerationResult = {
    file: path.join(targetDir, 'scraped.json'),
    overwrite: true,
    content: JSON.stringify(scraped, null, 2)
  }
  writeAllFiles([scrapedTs, ...playwright, json])
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
