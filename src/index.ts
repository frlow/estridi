import { getNodeMetadata } from './nodes'
import { createFeature, Feature, ParsedNode, ParsedTable, preapreNode } from './feature'

figma.showUI(__html__)
export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g
const isStartNode = (node: any) =>
  node.name === 'Start' &&
  node.children![0].strokeWeight?.toString()?.startsWith('2')

const isSection = (node: BaseNode) => node.type === 'SECTION'
const isAction = (node: BaseNode) => node.name === 'Signal listen'

const handleNode = (node?: BaseNode) => {
  if (!node) return undefined
  const parsedStartNode = traverse(node)
  return preapreNode(parsedStartNode)
}

const handleTable = (tableNode?: any): ParsedTable | undefined => {
  if (!tableNode) return undefined
  const header = tableNode.children.filter((c: any) => c.rowIndex === 0).map((c: any) => c.text?.characters?.replace(/[^a-zA-Z0-9 ]/g, ''))
  header.shift()
  const rows = tableNode.children.filter((c: any) => c.rowIndex > 0)
    .reduce((acc: any, cur: any) => {
      if (!acc[cur.rowIndex - 1]) acc[cur.rowIndex - 1] = {
        label: cur.text?.characters?.replace(allowedRegex, ''),
        values: []
      }
      else acc[cur.rowIndex - 1].values.push(cur.text?.characters?.replace(allowedRegex, ''))
      return acc
    }, [])
    .filter((r: any) => !!r.label)
  if (rows.length === 0) return undefined
  return {
    header,
    rows
  }
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'traverse') {
    const result: Feature[] = []
    const sections = figma.currentPage.children.filter((c) => isSection(c))
    for (const section of sections as SectionNode[]) {
      const nodes = section.children.filter((c) => isStartNode(c) || isAction(c))
      const tables = section.children.filter((c) => c.type === 'TABLE')
      const handledNodes = nodes.map(s => handleNode(s)).filter(s => !!s).flatMap(s => s as ParsedNode[][])
      const handledTables = tables.map(t => handleTable(t)).filter(t => !!t).flatMap(t => t as ParsedTable)
      if (handledNodes.length === 0 && handledTables.length === 0) continue
      const feature = createFeature(section.name, handledNodes, handledTables)
      result.push(feature)
    }
    const body = JSON.stringify(result)
    console.log(result)
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body
    }).catch(() => console.log('local server not started'))
  }
  if (msg.type === 'identify') {
    const nodes = figma.currentPage.selection
    for (const node of nodes) {
      console.log(getNodeMetadata(node))
    }
  }
}

const traverse = (node: any, visited: string[] = []): any => {
  if (visited.includes(node.id)) return { id: node.id }
  const connectors = node?.attachedConnectors.filter(
    (c: any) =>
      c?.dashPattern?.length === 0 &&
      c?.connectorStart?.endpointNodeId === node.id
  )
  const meta = getNodeMetadata(node)
  const nextNodes =
    meta?.type === 'gateway'
      ? connectors?.map((c: any) => {
        return {
          id: c.id,
          meta: {
            type: 'connector',
            text: meta.text.replace(allowedRegex, ''),
            value: c.name || 'unknown'
          },
          next: [
            traverse(figma.getNodeById(c?.connectorEnd?.endpointNodeId), [
              ...visited,
              node.id
            ])
          ]
        }
      })
      : connectors?.map((c: any) => {
        const nextNode = figma.getNodeById(c?.connectorEnd?.endpointNodeId)
        return traverse(nextNode, [...visited, node.id])
      })

  return {
    id: node.id,
    meta: getNodeMetadata(node),
    next: nextNodes
  }
}
