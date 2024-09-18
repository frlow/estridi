import {Estridi, EstridiTargets, Scraped, ScrapedNode, ScrapedUserAction,} from "../index";
import {handlesContent} from "./handles";
import {generatePlaywrightTest} from "./playwright";
import {generateVitestTest} from "./vitest";
import {generateWriterScript} from "./writer";

export const getKeysString = (scrapedNodes: ScrapedNode[]): string => {
  if (scrapedNodes.length === 0) return "    | 'N/A'"
  return scrapedNodes.map(node => `    | '${node.id}: ${node.text}'`).join("\n")
}

export const getTestableNodes = (scraped: Scraped) => scraped.filter(n => n.type === "script" || (n.type === "subprocess" && !n.link))

export const getActionKeys = (scrapedActions: ScrapedUserAction[]): string => {
  if (scrapedActions.length === 0) return "    | 'N/A'"
  return scrapedActions.flatMap(userAction =>
      Object.values(userAction.actions).map(action =>
          `    | '${userAction.id}: ${userAction.text} - ${action}'`))
      .join("\n")
}

export const generateTestFiles = (scraped: Scraped, estridi: Estridi, target: EstridiTargets, name: string, importSource: string = "estridi") => {
  const writtenFiles: string[] = []
  estridi.writeFile(`import type {Scraped} from '${importSource}'
export const scraped: Scraped = ${JSON.stringify(scraped, null, 2)}`, `tests/${name}.data.ts`)
  writtenFiles.push(`tests/${name}.data.ts`)
  const testFileName =
      target === "playwright" ? `${name}.spec.ts` :
      target === "vitest" ? `${name}.test.ts` :
      target === "writer" ? `${name}.writer.ts` :
      `${name}.error.ts`
  if (!estridi.fileExists(`tests/${name}.handles.ts`)) {
    const handles = handlesContent(name, testFileName)
    estridi.writeFile(handles, `tests/${name}.handles.ts`)
    writtenFiles.push(`tests/${name}.handles.ts`)
  }
  const testFile =
      target === "playwright" ? generatePlaywrightTest(name, scraped, importSource) :
      target === "vitest" ? generateVitestTest(name, scraped, importSource) :
      target === "writer" ? generateWriterScript(name, scraped, importSource) :

              "ERROR"
  estridi.writeFile(testFile, `tests/${testFileName}`)
  writtenFiles.push(`tests/${testFileName}`)
  return writtenFiles
}

export const getKeysBlock = (scraped: Scraped) => `export type GatewayKey =
${getKeysString(scraped.filter(n => n.type === "gateway"))}
export type ServiceCallKey =
${getKeysString(scraped.filter(n => n.type === "serviceCall"))}
export type ActionKey =
${getActionKeys(scraped.filter(n => n.type === "userAction"))}
export type TestNodeKey =
${getKeysString(getTestableNodes(scraped))}
export type TableKeys =
${getKeysString(scraped.filter(n => n.type === "table"))}`
