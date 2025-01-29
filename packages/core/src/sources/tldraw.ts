import { sanitizeText } from '../common/texts'
import { TlDrawNode } from './test/tldrawGenerator'

export type ProcessedNodes = Record<string, any>


export const processTldraw = async (
  data: { documents: TlDrawNode[] }
): Promise<Scraped> => {
  const findRawText = (node: any): string => {
    const text = node.state?.props?.text
    if ((text || '').trim() === '') {
      const parent = data.documents.find(n => n.state.id === node.state.parentId)
      const parentType = parent?.state?.type
      if (parentType === 'group') {
        const groupedText = data.documents.find(n =>
          n.state.parentId === parent.state.id &&
          n.state.type === "text")
        return groupedText?.state?.props.text || ""
      }
    }
    return text
  }

  const findText = (node: any) => sanitizeText(findRawText(node))

  const getNext = (node: any): string | undefined => {
    const connections = node.connections
    if (connections?.length === 1) return connections[0].id
    return undefined
  }

  const getType = (node: any): ScrapedNodeTypes => {
    const types: ScrapedNodeTypes[] = ['script', 'end', 'gateway', 'root', 'script', 'serviceCall', 'start', 'subprocess', 'table', 'userAction']
    if (['message', 'signalSend'].includes(node.state?.type)) return 'script'
    if (types.includes(node.state?.type)) return node.state?.type
    return 'other'
  }

  const getNodeMetadata = (node: any): ScrapedNode => {
    const type = getType(node)
    switch (type) {
      case 'script':
        const script: ScrapedScript = {
          type: 'script',
          id: node.state.id,
          text: findText(node),
          next: getNext(node),
          raw: findRawText(node)
        }
        return script
      default: {
        return {
          type: 'other',
          id: node.state.id,
          next: getNext(node),
          text: findText(node),
          raw: findRawText(node)
        } as ScrapedOther
      }
    }
  }

  const processData = (data: any, acc: ProcessedNodes) => {
    for (const node of data) {
      const id = node.state.id
      if (acc[id]) return
      acc[id] = node
    }
  }

  const mapConnections = (nodes: ProcessedNodes): ProcessedNodes => {
    const temp = structuredClone(nodes)
    const connections = Object.values(temp)
      .filter((n) => n.state.type === 'arrow' && n.state.typeName === 'shape')
      .map(n => {
        const findBinding = (terminal: 'start' | 'end') => Object.values(temp).find(c =>
          c.state.type === 'arrow' &&
          c.state.typeName === 'binding' &&
          c.state.fromId === n.state.id &&
          c.state.props?.terminal === terminal)?.state?.toId
        const from = findBinding('start')
        const to = findBinding('end')
        return { from, to, text: n.props?.text }
      })
    Object.keys(temp).forEach((key) => {
      const node = temp[key]
      node.connections = connections
        .filter((c) => {
          return c.from === node.state.id
        })
        .map((c) => ({ id: c.to, text: c.text }))
    })
    return temp
  }


  const nodes: ProcessedNodes = {}
  processData(data.documents, nodes)
  const nodesWithConnections = mapConnections(nodes)
  const nodeValues = Object.values(nodesWithConnections)
  const scraped = nodeValues.map((n) => getNodeMetadata(n))
  // return afterProcess(scraped, nodesWithConnections)
  return scraped
}
