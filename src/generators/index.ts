import {
  EstridiConfig,
  LogFunc,
  Scraped,
  ScrapedGateway,
  ScrapedScript,
  ScrapedServiceCall,
  ScrapedTable,
  ScrapedUserAction,
  WriteFileFunc
} from "../index";

export type GenerationKeys = {
  gatewayKeys: string[],
  serviceCallKeys: string[],
  actionKeys: string[],
  scriptKeys: string[],
  tableKeys: string[],
}

export const generateTestFiles = (config: EstridiConfig, scraped: Scraped, log: LogFunc, writeFile: WriteFileFunc) => {
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
  switch (config.target) {
    case "playwright": {
      break
    }
    default:
      break
  }
}
