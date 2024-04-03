import { Scraped } from '../common.js'

export const findAllPaths = (scraped: Scraped, rootId: string) => {
  const paths: string[][] = []
  const toProcess: { nodes: string[], stack: string[], current: string }[] = [{
    nodes: [rootId],
    stack: [],
    current: rootId
  }]
  while (toProcess.length > 0) {
    const path = toProcess.pop()!
    const current = scraped.find(node => node.id === path.current)
    const connections: string[] = [...Object.keys(current.connections || {}), ...(current.actions || [])]
    if (current.type === 'subprocess') {
      if (connections.length > 1) {
        throw 'Not supported!'
      }
      const subProcess = scraped.find(s => s.text === current.text && s.type === 'start')
      if (!subProcess) {
        toProcess.push(...connections.map((c) => ({
          nodes: [...path.nodes, c],
          current: c,
          stack: [...path.stack]
        })))
      } else {
        toProcess.push({
          nodes: [...path.nodes, subProcess.id],
          current: subProcess.id,
          stack: [...path.stack, ...connections]
        })
      }
    } else if (connections.length === 0) {
      if (path.stack.length > 0) {
        const returnId = path.stack[path.stack.length - 1]
        toProcess.push({
          nodes: [...path.nodes, returnId],
          current: returnId,
          stack: path.stack.slice(0, path.stack.length - 1)
        })
      } else paths.push(path.nodes)
    } else {
    }
    toProcess.push(...connections.filter(n => !path.nodes.includes(n)).map((c) => ({
      nodes: [...path.nodes, c],
      current: c,
      stack: [...path.stack]
    })))
  }
  return paths
}
