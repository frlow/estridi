import { Scraped } from '../common.js'

const getCurrent = (item: ProcessItem, scraped: Scraped) => scraped.find(node => node.id === item.nodes[item.nodes.length - 1])
const getConnections: (current: any, nodes: string[]) => string[] = (current, nodes) =>
  ([...Object.keys(current.connections || {}), ...(current.actions || [])])
    .filter(n => !nodes.includes(n)) // Filtering out loops

type ProcessItem = { nodes: string[], stack: string[] }

export const findAllPaths = (scraped: Scraped, rootId: string) => {
  const finishedPaths: string[][] = []
  const toProcess: ProcessItem[] = [{
    nodes: [rootId],
    stack: []
  }]
  while (toProcess.length > 0) {
    const path = toProcess.pop()!
    const current = getCurrent(path, scraped)
    const connections = getConnections(current, path.nodes)
    const stack = [...path.stack]
    if (connections.length === 0 && path.stack.length === 0 && !current.linked) {
      finishedPaths.push(path.nodes)
      continue
    }
    if (connections.length === 0 && stack.length > 0) {
      const fromStack = stack.splice(stack.length - 1, 1)[0]
      connections.push(fromStack)
    }

    const nextItems = current.linked ?
      [{
        stack: [...stack, ...connections],
        nodes: [...path.nodes, current.linked]
      }] :
      connections.map(c =>
        ({
          stack: [...stack],
          nodes: [...path.nodes, c]
        })
      )

    toProcess.push(...nextItems)
  }
  return finishedPaths
}
