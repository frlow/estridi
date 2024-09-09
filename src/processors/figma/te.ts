import {Node} from "figma-api";
import {LogFunc, Scraped, ScrapedNode, ScrapedNodeTypes, ScrapedOther, ScrapedScript, ScrapedTable} from "../../index";
import {ProcessedNodes} from "./index";
import {sanitizeText} from "../index";

const findText = (node: any) => {
  const children: any[] = node.children || []
  children.sort((a) => a.name === 'text' ? -1 : 1)
  return sanitizeText(children.find((c: any) => c.type === 'TEXT')?.characters || '')
}

const getType = (node: Node): ScrapedNodeTypes => {
  if (node.type as any === "TABLE") {
    const corner = (node as any).children[0]
    const cornerText: string = corner?.characters || "N/A"
    return cornerText.startsWith(".") ? "table" : "other"
  }
  if (node.name?.replace("3.", "").trim() === "Script") return "script"
  return "other"
}

const getNext = (node: any): string | undefined => {
  const connections = node.connections
  if (connections.length === 1) return connections[0].id
  return undefined
}

const getNodeMetadata = (node: Node, log: LogFunc): ScrapedNode => {
  const type = getType(node)
  switch (type) {
    case "table": {
      const rows: string[][] = Object.values((node as any).children.reduce((acc: Record<string, string[]>, cur: any) => ({
        ...acc,
        [cur.absoluteBoundingBox.y]: [...(acc[cur.absoluteBoundingBox.y] || []), cur.characters]
      }), {}))
      const table: ScrapedTable = {type: "table", rows, id: node.id}
      log("parsedTable", table)
      return table
    }
    case "script": {

      const script: ScrapedScript = {
        type: "script",
        id: node.id,
        text: findText(node),
        next: getNext(node)
      }
      log("parsedScript", script)
      return script
    }
    default: {
      const other: ScrapedOther = {type: "other", id: node.id}
      log("parsedOther", other)
      return other
    }
  }
}

export const processTeFigma = async (nodes: ProcessedNodes, log: LogFunc): Promise<Scraped> =>
    Object.values(nodes).map(n => getNodeMetadata(n, log))
