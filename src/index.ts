import {process} from "./processors";
import {loadFigmaDocument} from "./processors/figma";
export * from './scraped.js'

export type BaseConfig = {
  logging: "normal" | "verbose"
}

export type FigmaConfig = {
  token: string
  fileId: string
  type: "figma"
  variant: "TE" | "Open"
} & BaseConfig

export type EstridiConfig = FigmaConfig

export type Estridi = ReturnType<typeof estridi>

const loadConfig = (): EstridiConfig => {
  throw "Not implemented"
}

export type LogEvents =
    "loadedData" |
    "figmaNodes" |
    "parsedScript" |
    "parsedTable" |
    "parsedOther"
export type EstridiLog = {
  tag: LogEvents,
  data: any
}[]

export type LogFunc = (tag: LogEvents, data: any) => void
export const estridi = () => {
  const _log: EstridiLog = []
  const generate = async () => {
    const config = ret.loadConfig()
    const log: LogFunc = (tag, data) => {
      if (config.logging === "verbose") _log.push({data, tag})
    }
    return await process(config, ret, log)
  }

  const ret = {
    getLog: (tag: LogEvents) => _log.find(l => l.tag === tag)?.data,
    getAllLog: (tag: LogEvents) => _log.filter(l => l.tag === tag)?.map(l => l.data),
    log: _log,
    loadConfig,
    loadFigmaDocument,
    generate
  }
  return ret
}
