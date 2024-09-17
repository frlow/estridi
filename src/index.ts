import {process} from "./processors";
import {loadFigmaDocument} from "./processors/figma";
import {filterScraped} from "./common";
import * as fs from "fs";
import {generateTestFiles} from "./generators";
import * as path from "path";
import {Scraped, ScrapedStart} from "./scraped";

export * from './scraped.js'

export type RootsConfig = string[] | boolean | undefined

export const estridiTargets = ['playwright', 'vitest'] as const
export type EstridiTargets = typeof estridiTargets[number]

export type BaseConfig = {}

export type EstridiParameters = { target?: EstridiTargets, rootName?: string, importSource?: string }

export type FigmaConfig = {
  token: string
  fileId: string
  type: "figma"
  variant: "TE"
} & BaseConfig

export type EstridiConfig = FigmaConfig

export type Estridi = ReturnType<typeof estridi>

const loadConfig = (): EstridiConfig => {
  throw "loadConfig must be overridden"
}
export type WriteFileFunc = typeof writeFile
const writeFile = (content: any, fileName: string): void => {
  throw "writeFile must be overridden"
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
    "parameterError" |
    "parametersUsed" |
    "filteredNodes" |
    "figmaNodes"
export type EstridiLog = {
  tag: LogEvents,
  data: any
}[]



const validateParams = (params: EstridiParameters, scraped: Scraped): {
  rootName?: string,
  target?: EstridiTargets,
  error?: string
} => {
  const roots: ScrapedStart[] = scraped.filter((s: ScrapedStart) => s.isRoot) as ScrapedStart[]
  let rootName: string
  if (!params.rootName && roots.length === 1) rootName = roots[0].text
  else if (!params.rootName) return {error: "Root name must be set if more than one root exists"}
  else if (!roots.some(r => r.text === params.rootName))
    return {error: "Root node not found"}
  else
    rootName = params.rootName
  const target: EstridiTargets = params.target || "playwright"
  if (!estridiTargets.includes(target)) return {error: "Target not valid"}
  return {rootName, target}
}

const fileExists = (fileName: string): boolean => fs.existsSync(fileName)

export type LogFunc = (tag: LogEvents, data: any) => void
export const estridi = (params: EstridiParameters) => {
  const _log: EstridiLog = []
  const generate = async () => {
    const config = ret.loadConfig()
    if (!config) return undefined
    ret.log("loadedConfig", config)
    const data = await ret.loadData(config)
    if (!data) {
      ret.log("couldNotLoadData", null)
      return undefined
    }
    ret.log("loadedData", data)
    const processed = await process(config, data, ret.log)
    ret.log("allParsed", processed)

    const validatedParams = validateParams(params, processed)
    if (validatedParams.error) {
      ret.log("parameterError", validatedParams.error)
      return
    }
    ret.log("parametersUsed", validatedParams)
    const filtered = filterScraped(processed, validatedParams.rootName!)
    ret.log("filteredNodes", filtered)
    return generateTestFiles(filtered, ret, validatedParams.target!, validatedParams.rootName, params.importSource)
  }

  const loadData = async (config: EstridiConfig): Promise<any> => {
    if (config.type === "figma") return ret.loadFigmaDocument(config)
    debugger
    throw "not implemented"
  }

  const ret = {
    log: (key: LogEvents, content: any)=>{}, // Override this to use logging.
    loadFigmaDocument,
    generate,
    loadData,
    loadConfig,
    writeFile,
    fileExists
  }
  return ret
}
