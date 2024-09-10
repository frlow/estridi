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
    "couldNotLoadData" |
    "loadedConfig" |
    "loadedData" |
    "parsedScript" |
    "parsedServiceCall" |
    "parsedOther" |
    "parsedRoot" |
    "parsedStart" |
    "parsedGateway" |
    "parsedSubprocess" |
    "parsedUserAction" |
    "parsedTable" |
    "allParsed" |
    "figmaNodes"
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
    if (!config) return undefined
    log("loadedConfig", config)
    const data = await ret.loadData(config)
    log("loadedData", data)
    if (!data) {
      log("couldNotLoadData", null)
      return undefined
    }
    const processed = await process(config, data, log)
    log("allParsed", processed)
    return processed
  }

  const loadData = async (config: EstridiConfig): Promise<any> => {
    if (config.type === "figma") return ret.loadFigmaDocument(config)
    debugger
    throw "not implemented"
  }

  const ret = {
    getLog: (tag: LogEvents) => _log.findLast(l => l.tag === tag)?.data,
    getAllLog: (tag: LogEvents) => _log.filter(l => l.tag === tag)?.map(l => l.data),
    log: _log,
    loadConfig,
    loadData,
    loadFigmaDocument,
    generate
  }
  return ret
}
