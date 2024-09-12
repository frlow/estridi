import {process} from "./processors";
import {loadFigmaDocument} from "./processors/figma";
import {filterScraped} from "./common";
import * as fs from "fs";
import {generateTestFiles} from "./generators";
import * as path from "path";

export * from './scraped.js'

export type RootsConfig = string[] | boolean | undefined
export type EstridiTargets = 'playwright' | 'vitest'

export type BaseConfig = {
  logging: "normal" | "verbose"
  roots?: RootsConfig
  target?: EstridiTargets
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

export type WriteFileFunc = typeof writeFile
const writeFile = (content: any, fileName: string) => {
  const toWrite = typeof content === "string" ? content : JSON.stringify(content, null, 2)
  fs.mkdirSync(path.parse(fileName).dir, {recursive: true})
  fs.writeFileSync(fileName, toWrite, 'utf8')
}

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
    if (!data) {
      log("couldNotLoadData", null)
      return undefined
    }
    log("loadedData", data)
    const processed = await process(config, data, log)
    log("allParsed", processed)
    const filtered = filterScraped(processed, config.roots)
    generateTestFiles(config, filtered, log, ret.writeFile)
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
    loadFigmaDocument,
    generate,
    loadData,
    loadConfig,
    writeFile
  }
  return ret
}
