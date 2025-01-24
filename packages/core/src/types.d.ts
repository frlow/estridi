import * as S from './scraped.ts'

declare global {
  type Scraped = S.Scraped
  type ScrapedNode = S.ScrapedNode
  type ScrapedStart = S.ScrapedStart
  type ScrapedTable = S.ScrapedTable
  type ScrapedUserAction = S.ScrapedUserAction
  type ScrapedServiceCall = S.ScrapedServiceCall
  type BaseNode = S.BaseNode
  type FigmaConfig = S.FigmaConfig
  type EstridiConfig = S.EstridiConfig
  type FileConfig = S.FileConfig
  type ScrapedTable = S.ScrapedTable
  type ScrapedScript = S.ScrapedScript
  type ScrapedSubprocess = S.ScrapedSubprocess
  type ScrapedGateway = S.ScrapedGateway
  type ScrapedOther = S.ScrapedOther
  type ScrapedNodeTypes = S.ScrapedNodeTypes
}

export { }
