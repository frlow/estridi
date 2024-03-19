export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g
export type GenerationResult = { file: string, content: string, overwrite: boolean }
export type Scraped = any[]
// export type Scraped = Record<string, NodeMetadata & {
//   connections?: Record<string, string>
//   rows?: string[][]
// }>

// export const scrapedArray = (scraped: Scraped) => Object.entries(scraped).map(s => ({ id: s[0], ...s[1] }))
