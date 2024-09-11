import {EstridiConfig, LogFunc, Scraped, ScrapedGateway, ScrapedServiceCall} from "../index";

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
  return []
}
