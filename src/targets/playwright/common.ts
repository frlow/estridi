import { _ } from '../../common/texts.js'
import { generateScriptTest, generateServiceCallTest } from './testScript.js'
import { generateSubprocessTableTest } from './subprocessTable.js'

export const rawCommentBlock = (raw: string) => `/*
${raw}
*/`.replace(/^/gm, _(2))

export const allowedRegexPermissive = /[^a-zA-Z0-9åäöÅÄÖ\[]\(\)-_ ]/g

export const getRootNote = (scraped: Scraped): string => {
  const root = scraped.find((n: ScrapedStart) => n.isRoot)
  if (!root?.note) return '\n\n'
  else return `/*
${root.note.replaceAll(allowedRegexPermissive, ' ')}
*/
`
}

export const generateTest = (
  scraped: Scraped,
  node: ScrapedNode,
  blockPath: any[],
  usedNames: Record<string, number>
): string => {
  if (node.type === 'script') {
    return generateScriptTest(scraped, node, blockPath, usedNames)
  } else if (node.type === 'serviceCall') {
    return generateServiceCallTest(scraped, node, blockPath, usedNames)
  } else if (node.type === 'subprocess' && node.tableKey) {
    return generateSubprocessTableTest(scraped, node, blockPath)
  } else {
    debugger
  }
}
