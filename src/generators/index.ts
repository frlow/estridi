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

export type GenerationKeys = {
  gatewayKeys: string[],
  serviceCallKeys: string[],
  actionKeys: string[],
  scriptKeys: string[],
  tableKeys: string[],
}

export const generateTestFiles = (config: EstridiConfig, scraped: Scraped, estridi: Estridi, target: EstridiTargets, name: string) => {
  const writtenFiles: string[] = []
  estridi.writeFile(`export const scraped = ${JSON.stringify(scraped, null, 2)}`, `tests/${name}.data.ts`)
  writtenFiles.push(`tests/${name}.data.ts`)
  const testFileName = target === "playwright" ? `${name}.spec.ts` :
      `${name}.test.ts`
  if (!estridi.fileExists(`tests/${name}.handles.ts`)) {
    const handles = handlesContent(name, testFileName)
    estridi.writeFile(handles, `tests/${name}.handles.ts`)
    writtenFiles.push(`tests/${name}.handles.ts`)
  }
  const gatewayKeys = scraped.filter(s => s.type === "gateway").map((g: ScrapedGateway) =>
      `${g.id}: ${g.text}`)
  const serviceCallKeys = scraped.filter(s => s.type === "serviceCall").map((g: ScrapedServiceCall) =>
      `${g.id}: ${g.text}`)
  const actionKeys = scraped.filter(s => s.type === "userAction").map((g: ScrapedUserAction) =>
      `${g.id}: ${g.text}`)
  const scriptKeys = scraped.filter(s => s.type === "script").map((g: ScrapedScript) =>
      `${g.id}: ${g.text}`)
  const tableKeys = scraped.filter(s => s.type === "table").map((g: ScrapedTable) =>
      `${g.id}: ${g.text}`)
  return writtenFiles
}
