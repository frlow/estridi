const findBlockRoot = (scraped: Scraped, blockPath: any[]): ScrapedStart | undefined => {
  if (blockPath.length === 0) return undefined
  return scraped.find(n => n.id === blockPath[blockPath.length - 1].link) as ScrapedStart
}

export const findShortestPathToNode = (scraped: Scraped, nodeId: string, blockPath: any[] = []) => {
  const root = findBlockRoot(scraped, blockPath) || scraped.find((n: ScrapedStart) => n.type === 'root')
  if (nodeId === root.id) return []
  let crawled = [[root]]
  let max = 100000

  const validateGateways = (path: ScrapedNode[]) => {
    const gatewayValues = path
      .filter((n) => n.type === 'gateway')
      .map((n) => ({
        name: n.text,
        value: n.options[path[path.indexOf(n) + 1]?.id]
      }))
      .reduce(
        (acc, cur) => ({
          ...acc,
          [cur.name]: [...(acc[cur.name] || []), cur.value]
        }),
        {}
      )
    // Filter out gateway values that are linked but have differing values
    return !Object.values(gatewayValues).some((values: string[]) => {
      values.some((v, i, arr) => arr.indexOf(v) !== i)
    })
  }
  while (true) {
    const temp: ScrapedNode[][] = []
    for (const path of crawled) {
      const lastNode = path[path.length - 1] as any
      const nodeIds = [
        lastNode.next,
        lastNode.link,
        ...Object.keys(lastNode.options || {}),
        ...Object.keys(lastNode.actions || {})
      ].filter((id) => !!id)
      for (const id of nodeIds) {
        const newPath = [...path, scraped.find((n) => n.id === id)]
        if (!validateGateways(newPath)) continue
        if (id === nodeId) {
          return [...blockPath, ...newPath]
        }
        temp.push(newPath)
      }
      crawled = temp
      if (max-- === 0) throw 'Can\'t find node'
    }
  }
}
