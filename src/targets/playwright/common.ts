import { _ } from '../../common/texts.js'
import { generateScriptTest } from './testScript.js'
import { generateSubprocessTableTest } from './subprocessTable.js'

export const usedNames: Record<string, number> = {}
export const getTestName = (name: string): string => {
  usedNames[name] = usedNames[name] !== undefined ? usedNames[name] + 1 : 0
  if (usedNames[name]) return `${name} ${usedNames[name]}`
  return name
}
export const rawCommentBlock = (raw: string) => `/*
${raw}
*/`.replace(/^/gm, _(2))


export const getRootNote = (scraped: Scraped): string => {
  const root = scraped.find((n: ScrapedStart) => n.isRoot)
  if (!root?.note) return '\n\n'
  else return `/*
${root.note}
*/
`
}

export const generateTest = (scraped: Scraped, node: ScrapedNode, blockPath: any[] = []): string => {
  if (node.type === 'script' || node.type === 'serviceCall') {
    return generateScriptTest(scraped, node, blockPath)
  } else if (node.type === 'subprocess' && node.tableKey) {
    return generateSubprocessTableTest(scraped, node, blockPath)
  } else {
    debugger
  }
}
