import { DrawIoConfig, LogFunc, Scraped } from '../../index.js'
import fs from 'fs'
import { XMLParser } from 'fast-xml-parser'
import { processTeDrawIo } from './te.js'

export const loadDrawIoDocument = (config: DrawIoConfig): any => {
  const content = fs.readFileSync(config.drawIoFile, 'utf8')
  return new XMLParser({ ignoreAttributes: false }).parse(content)
}

const discoverVariant = (data: any): 'TE' => {
  return 'TE'
}

export const processDrawIo = async (
  data: any,
  log: LogFunc,
): Promise<Scraped> => {
  const variant = discoverVariant(data)
  switch (variant) {
    case 'TE':
      return await processTeDrawIo(data, log)
    default:
      throw `${variant} not implemented yet`
  }
}
