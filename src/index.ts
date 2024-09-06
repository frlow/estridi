import { EstridiConfig } from './common.js'
import { process } from './processors/index.js'
import { generateAll } from './generators/index.js'

export const runEstridi = async (config: EstridiConfig)=>{
  const scraped = await process(config)
  generateAll(scraped, config)
}
