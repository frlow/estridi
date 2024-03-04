import { generateJSON } from './json'
import { writeAllFiles } from './files'
import { Scraped } from '../common'

export type GenerationResult = { file: string, content: string, overwrite: boolean }

export const freezeTests = true

export const getFileName = (name: string) =>
  name
    .replace(/ /g, '_')
    .replace(/[:|\/]/g, '')
    .toLowerCase()

export const generateAll = (scraped: Scraped) => {
  // fs.mkdirSync('output', { recursive: true })
  generateJSON('output', scraped)
  const filesToWrite: GenerationResult[] = []
  // filesToWrite.push(...generateVitest(path.join('output', 'vitest'), features))
  // filesToWrite.push(...generatePlaywright(path.join('output', 'playwright'), features))
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
