import {
  Estridi,
  EstridiConfig,
  EstridiTargets,
  Scraped,
  ScrapedGateway,
  ScrapedScript,
  ScrapedServiceCall,
  ScrapedTable,
  ScrapedUserAction,
} from "../index";
import {handlesContent} from "./handles";
import {generatePlaywrightTest} from "./playwright";
import {generateVitestTest} from "./vitest";

export type GenerationKeys = {
  gatewayKeys: string[],
  serviceCallKeys: string[],
  actionKeys: string[],
  scriptKeys: string[],
  tableKeys: string[],
  name: string,
  importSource?: string
}

export const getKeysString = (keys: string[]) => {
  if(keys.length===0) return "N/A"
  return keys.map(key=>`    | '${key}'`).join("\n")
}

export const generateTestFiles = (config: EstridiConfig, scraped: Scraped, estridi: Estridi, target: EstridiTargets, name: string) => {
  const writtenFiles: string[] = []
  estridi.writeFile(`export const scraped = ${JSON.stringify(scraped, null, 2)}`, `tests/${name}.data.ts`)
  writtenFiles.push(`tests/${name}.data.ts`)
  const testFileName =
      target === "playwright" ? `${name}.spec.ts` :
          target === "vitest" ? `${name}.test.ts` :
              `${name}.error.ts`
  if (!estridi.fileExists(`tests/${name}.handles.ts`)) {
    const handles = handlesContent(name, testFileName)
    estridi.writeFile(handles, `tests/${name}.handles.ts`)
    writtenFiles.push(`tests/${name}.handles.ts`)
  }
  const gatewayKeys = scraped.filter(s => s.type === "gateway").map((g: ScrapedGateway) =>
      `${g.id}: ${g.text}`)
  const serviceCallKeys = scraped.filter(s => s.type === "serviceCall").map((sc: ScrapedServiceCall) =>
      `${sc.id}: ${sc.text}`)
  const actionKeys = scraped.filter(s => s.type === "userAction").flatMap((ua: ScrapedUserAction) =>
      Object.values(ua.actions).map(a=>`${ua.id}: ${ua.text} - ${a}`))
  const scriptKeys = scraped.filter(s => s.type === "script").map((s: ScrapedScript) =>
      `${s.id}: ${s.text}`)
  const tableKeys = scraped.filter(s => s.type === "table").map((t: ScrapedTable) =>
      `${t.id}: ${t.text}`)
  const keys = {actionKeys, gatewayKeys, scriptKeys, serviceCallKeys, tableKeys, name}
  const testFile =
      target === "playwright" ? generatePlaywrightTest(keys) :
          target === "vitest" ? generateVitestTest(keys) :
              "ERROR"
  estridi.writeFile(testFile, `tests/${testFileName}`)
  writtenFiles.push(`tests/${testFileName}`)
  return writtenFiles
}
