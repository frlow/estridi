import {Node} from "figma-api";
import {
  LogFunc,
  Scraped,
  ScrapedGateway,
  ScrapedNode,
  ScrapedNodeTypes,
  ScrapedOther,
  ScrapedScript,
  ScrapedServiceCall,
  ScrapedStart,
  ScrapedSubprocess, ScrapedTable,
  ScrapedUserAction
} from "../../index";
import {ProcessedNodes} from "./index";
import {isNodeInside, sanitizeText} from "../index";

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
  if (node.name?.replace("4.", "").trim() === "Service call") return "serviceCall"
  if (node.name?.replace("01.", "").trim() === "Start") return "start"
  if (node.name?.replace("04.", "").trim() === "Gateway") return "gateway"
  if (node.name?.replace("2.", "").trim() === "Subprocess") return "subprocess"
  if (node.name?.replace("1.", "").trim() === "User action") return "userAction"
  if (node.name?.replace("05.", "").trim() === "Signal listen") return "signalListen" as any
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
    case "serviceCall": {
      const serviceCall: ScrapedServiceCall = {
        type: "serviceCall",
        id: node.id,
        text: findText(node),
        next: getNext(node)
      }
      log("parsedServiceCall", serviceCall)
      return serviceCall
    }
    case "start": {
      const connection = (node as any).connections[0]
      const isRoot = connection?.text?.startsWith("root:")
      const start: ScrapedStart = {
        type: "start",
        id: node.id,
        text: connection?.text?.replace("root:", "") || "start",
        next: getNext(node),
        isRoot: isRoot
      }
      log(isRoot ? "parsedRoot" : "parsedStart", start)
      return start
    }
    case "gateway": {
      const gateway: ScrapedGateway = {
        type: "gateway",
        id: node.id,
        text: findText(node),
        options: ((node as any).connections || []).reduce((acc, cur) => ({...acc, [cur.id]: cur.text}), {})
      }
      log("parsedGateway", gateway)
      return gateway
    }
    case "subprocess": {
      return {
        type: "subprocess",
        id: node.id,
        text: findText(node),
        next: getNext(node),
        link: undefined
      }
    }
    case "userAction": {
      return {
        type: "userAction",
        id: node.id,
        text: findText(node),
        next: getNext(node),
        actions: {}
      }
    }
    default: {
      const other: ScrapedOther = {type: "other", id: node.id, next: getNext(node)}
      log("parsedOther", other)
      return other
    }
  }
}

const afterProcess = (scraped: Scraped, nodes: ProcessedNodes, log: LogFunc): Scraped => {
  const ret = structuredClone(scraped)
  ret.filter(node => node.type === "subprocess").forEach((sp: ScrapedSubprocess) => {
    const linkNode = ret.find(n => n.type === "start" && n.text === sp.text)
    sp.link = linkNode?.id
    log("parsedSubprocess", sp)
  })
  ret.filter(node => node.type === "userAction").forEach((ua: ScrapedUserAction) => {
    const uaNode = nodes[ua.id]
    const actions = Object.values(nodes).filter((n) => n.absoluteBoundingBox && isNodeInside(uaNode.absoluteBoundingBox, n.absoluteBoundingBox))
    actions.forEach(a => ua.actions[getNext(a)] = findText(a))
    log("parsedUserAction", ua)
  })
  return ret
}

export const processTeFigma = async (nodes: ProcessedNodes, log: LogFunc): Promise<Scraped> => {
  const nodeValues = Object.values(nodes)
  const scraped = nodeValues.map(n => getNodeMetadata(n, log))
  return afterProcess(scraped, nodes, log)
}