import { Scraped, ScrapedNode } from '../common.js'


export const normalizeScraped = (scraped: Scraped) => {
  const processNode = (node: ScrapedNode) => {
    const ret: any = {}
    ret.type = node.type
    ret.text = node.text
    if (node.rootName) ret.rootName = node.rootName
    if (node.type === 'end') ret.text = 'end'
    ret.connections = {}
    Object.entries(node.connections || {}).forEach(c => {
        let tag = c[1]
        if (node.type === 'start') tag = 'start'
        const target = scraped.find(n => n.id === c[0])!
        ret.connections[tag] = processNode(target)
      }
    )
    ret.actions = []
    ;(node.actions || []).forEach(actionId => {
      const target = scraped.find(n => n.id === actionId)!
      ret.actions.push(processNode(target))
    })
    return ret
  }
  const rootNodes = scraped.filter(n => n.type === 'start')
  const processedRootNodes = rootNodes.map(processNode)
  const tables = scraped.filter(n => n.type === 'table').map((n: any) => {
    delete n.id
    return n
  })
  return [...processedRootNodes, ...tables]
}
