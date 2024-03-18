import { writeAllFiles } from './utils/files'
import { Scraped } from '../common'
import { generatePlaywrightTests } from './playwright'

export type GenerationResult = { file: string, content: string, overwrite: boolean }

export const getFileName = (name: string) =>
  name
    .replace(/ /g, '_')
    .replace(/[:|\/"]/g, '')
    .toLowerCase()


export const generateAll = (scraped: Scraped) => {
  const json: GenerationResult = {
    content: JSON.stringify(scraped, null, 2),
    file: 'output/scraped.json',
    overwrite: true
  }
  const playwright = generatePlaywrightTests(scraped, "output", "demo")
  writeAllFiles([json, playwright])
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
