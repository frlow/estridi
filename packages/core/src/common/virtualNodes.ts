import { Scraped, ScrapedGateway } from '../scraped'
import { autoText } from './texts'
import { getNodeConnections } from './filter'

export const injectVirtualNodes = async (scraped: Scraped): Promise<Scraped> => {
  const ret = structuredClone(scraped)
  const findText = (gw: ScrapedGateway): string => {
    const toProcess = getNodeConnections(gw)
    while (toProcess.length > 0) {
      const currentId = toProcess.shift()
      if (currentId.endsWith('-Virtual'))
        continue
      const currentNode = ret.find(n => n.id === currentId)
      if (currentNode.type !== 'gateway' && currentNode.raw) return currentNode.raw
      if (currentNode.type === 'connector')
        toProcess.push(...getNodeConnections(currentNode))
      else toProcess.unshift(...getNodeConnections(currentNode))
    }
  }


  ret.filter(n => n.type === 'gateway').forEach(gw => {
    Object.entries(gw.options || {}).forEach(([optionId, optionText]) => {
      const next = scraped.find(n => n.id === optionId)
      if (!next || next.type !== 'connector') return
      delete gw.options[optionId]
      const virtualId = `${gw.id}-Virtual`
      gw.options[virtualId] = optionText
      const text = findText(gw)
      if (!text) return
      ret.push({
        id: `${gw.id}-Virtual`,
        ...autoText(`Negative: ${text}`),
        type: 'script',
        variant: 'virtual' as any,
        next: optionId
      })
    })
  })
  return ret
}
