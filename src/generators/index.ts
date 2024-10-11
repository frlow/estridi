import {
  Estridi,
  EstridiTargets,
  Scraped,
  ScrapedNode,
  ScrapedUserAction,
} from '../index.js'
import { handlesContent } from './handles.js'
import { generatePlaywrightTest } from './playwright.js'
import { generateVitestTest } from './vitest.js'
import { generateWriterScript } from './writer.js'

export const getKeysString = (scrapedNodes: ScrapedNode[]): string => {
  if (scrapedNodes.length === 0) return "    | 'N/A'"
  return scrapedNodes
    .map((node) => `    | '${node.id}: ${node.text}'`)
    .join('\n')
}

export const getTestableNodes = (scraped: Scraped) =>
  scraped.filter(
    (n) => n.type === 'script' || (n.type === 'subprocess' && !n.link),
  )

export const getActionKeys = (scrapedActions: ScrapedUserAction[]): string => {
  if (scrapedActions.length === 0) return "    | 'N/A'"
  return scrapedActions
    .flatMap((userAction) =>
      Object.values(userAction.actions).map(
        (action) => `    | '${userAction.id}: ${userAction.text} - ${action}'`,
      ),
    )
    .join('\n')
}

export const generateTestFiles = (
  scraped: Scraped,
  estridi: Estridi,
  target: EstridiTargets,
  name: string,
  importSource: string = 'estridi',
) => {
  const writtenFiles: string[] = []
  estridi.writeFile(
    `import type {Scraped} from '${importSource}'
export const scraped: Scraped = ${JSON.stringify(scraped, null, 2)}`,
    `${name}.data.ts`,
  )
  writtenFiles.push(`${name}.data.ts`)
  if (target === 'data') return writtenFiles
  const testFileName =
    target === 'playwright'
      ? `${name}.spec.ts`
      : target === 'vitest'
        ? `${name}.test.ts`
        : target === 'writer'
          ? `${name}.writer.ts`
          : `${name}.error.ts`
  if (!estridi.fileExists(`${name}.handles.ts`)) {
    const handles = handlesContent(name, testFileName)
    estridi.writeFile(handles, `${name}.handles.ts`)
    writtenFiles.push(`${name}.handles.ts`)
  }
  const testFile =
    target === 'playwright'
      ? generatePlaywrightTest(name, scraped, importSource)
      : target === 'vitest'
        ? generateVitestTest(name, scraped, importSource)
        : target === 'writer'
          ? generateWriterScript(name, scraped, importSource)
          : 'ERROR'
  estridi.writeFile(testFile, `${testFileName}`)
  writtenFiles.push(`${testFileName}`)
  return writtenFiles
}

export const getKeysBlock = (scraped: Scraped) => `export type GatewayKey =
${getKeysString(scraped.filter((n) => n.type === 'gateway'))}
export type ServiceCallKey =
${getKeysString(scraped.filter((n) => n.type === 'serviceCall'))}
export type ActionKey =
${getActionKeys(scraped.filter((n) => n.type === 'userAction'))}
export type TestNodeKey =
${getKeysString(getTestableNodes(scraped))}
export type TableKeys =
${getKeysString(scraped.filter((n) => n.type === 'table'))}`
