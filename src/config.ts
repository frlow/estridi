import { EstridiConfig } from './scraped.js'

export type EstridiConfigExtended = ReturnType<typeof createEstridiConfig>

export const createEstridiConfig = (
  args: { config: EstridiConfig }) => args
