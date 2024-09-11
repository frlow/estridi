import {
  EstridiConfig,
  LogFunc,
  Scraped,
  ScrapedGateway,
  ScrapedScript,
  ScrapedServiceCall,
  ScrapedTable,
  ScrapedUserAction
} from "../index";

export const generateTestFiles = (config: EstridiConfig, scraped: Scraped, log: LogFunc): {
  name: string,
  content: string
}[] => {
  const gatewaysKeys = scraped.filter(s => s.type === "gateway").map((g: ScrapedGateway) =>
      `${g.id}: ${g.text}`)
  log("gatewayKeys", gatewaysKeys)
  const serviceCallKeys = scraped.filter(s => s.type === "serviceCall").map((g: ScrapedServiceCall) =>
      `${g.id}: ${g.text}`)
  log("serviceCallKeys", serviceCallKeys)
  const actionKeys = scraped.filter(s => s.type === "userAction").map((g: ScrapedUserAction) =>
      `${g.id}: ${g.text}`)
  log("actionKeys", actionKeys)
  const scriptKeys = scraped.filter(s => s.type === "script").map((g: ScrapedScript) =>
      `${g.id}: ${g.text}`)
  log("testNodeKeys", scriptKeys)
  const tableKeys = scraped.filter(s => s.type === "table").map((g: ScrapedTable) =>
      `${g.id}: ${g.text}`)
  log("tableKeys", tableKeys)
  return []
}
