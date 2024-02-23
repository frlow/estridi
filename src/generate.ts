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
  const thenTypes = ['script', 'message', 'serviceCall', 'subprocess']
  let ret = '  Scenario:'
  const given: string[] = []
  const when: string[] = []
  const then: string[] = []
  for (const node of nodes.filter((n) => !!n.meta)) {
    if (thenTypes.includes(node.meta!.type))
      then.push(
        '\n    Then [' +
          node.meta!.type +
          '] ' +
          node.meta?.text +
          ' #' +
          node.id,
      )
    else if (node.meta!.type === 'connector' && node.meta!.text)
      given.push('\n    Given ' + node.meta!.text + ' #' + node.id)
    else if (node.meta!.type === 'signalListen')
      when.push('\n    When ' + node.meta!.text + ' #' + node.id)
  }
  console.log('given', given)
  console.log('when', when)
  console.log('then', then)
  given.forEach((text) => (ret += text))
  when.forEach((text) => (ret += text))
  then.forEach((text) => (ret += text))
  return ret + '\n'
}

export const createFeature = (name: string, nodes: ParsedNode[][]) =>
  `Feature: ${name}
${nodes.map((n) => createScenarios(n)).join('\n')}
  
`
