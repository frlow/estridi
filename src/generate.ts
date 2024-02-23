export type ParsedSection = {
  name: string
  node: ParsedNode
}
export type ParsedNode = {
  id: string
  meta?: { type: string; text: string }
  next?: ParsedNode[]
}

export const handleNode = (node: ParsedNode): ParsedNode[][] => {
  const toHandle: { node: ParsedNode; acc: ParsedNode[] }[] = [
    { node, acc: [] },
  ]
  const ret: any = []
  while (toHandle.length > 0) {
    for (const current of [...toHandle]) {
      toHandle.splice(toHandle.indexOf(current), 1)
      toHandle.push(
        ...(current.node.next?.map((n) => ({
          node: n,
          acc: [...current.acc, current.node],
        })) || []),
      )
      if ((current.node.next?.length || 0) === 0) {
        ret.push([...current.acc, current.node])
      }
    }
  }

  console.log('ret', ret)
  return ret
}

const createScenarios = (nodes: ParsedNode[]) => {
  const given: string[] = []
  let ret = ''
  nodes.forEach((node) => {
    const thens = ['script', 'message', 'serviceCall', 'subprocess']
    if (thens.includes(node.meta?.type || '')) {
      ret += '\n  Scenario: '
      given.forEach((g) => (ret += '\n    Given ' + g))
      ret +=
        '\n    Then ' +
          node.meta?.type +
          ': ' +
          node.meta?.text?.replace(/\n/, '') || 'N/A'
    }
    if (node.meta?.type === 'connector' && node.meta.text)
      given.push(node.meta.text)
  })
  return ret
}

export const createFeature = (name: string, nodes: ParsedNode[][]) =>
  `Feature: ${name}
${nodes.map((n) => createScenarios(n)).join('\n')}
  
`
