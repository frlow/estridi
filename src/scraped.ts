export type BaseNode = { id: string }

export type ScrapedNodeTypes = "table" | "other" | "script"
export type ScrapedNodeType<T extends ScrapedNodeTypes> = T

export type ScrapedOther = {
  type: ScrapedNodeType<"other">,
  next?: string
} & BaseNode

export type ScrapedTable = {
  type: ScrapedNodeType<"table">,
  rows: string[][]
} & BaseNode

export type ScrapedScript = {
  type: ScrapedNodeType<"script">,
  text: string,
  next?: string
} & BaseNode


export type ScrapedNode =
    ScrapedTable |
    ScrapedOther |
    ScrapedScript
export type Scraped = ScrapedNode[]
