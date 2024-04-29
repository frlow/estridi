export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g
export type GenerationResult = { file: string, content: string, overwrite: boolean }
export type Scraped = any[]
export const testedNodeTypes = ['message', 'script', 'subprocess', 'signalSend']
export const scrapedFile = 'scraped.json'
