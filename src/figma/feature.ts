export type ParsedNode = {
  id: string
  meta?: { type: string; text: string; value?: string }
  next?: ParsedNode[]
}

export type ParsedTable = {
  header: string[]
  rows: {
    label: string,
    values: string[]
  }[]
}

export const prepareNode = (node: ParsedNode | undefined): ParsedNode[][] | undefined => {
  if (!node) return undefined
  const toHandle: { node: ParsedNode; acc: ParsedNode[] }[] = [
    { node, acc: [] }
  ]
  const ret: any = []
  while (toHandle.length > 0) {
    for (const current of [...toHandle]) {
      toHandle.splice(toHandle.indexOf(current), 1)
      toHandle.push(
        ...(current.node.next?.map((n) => ({
          node: n,
          acc: [...current.acc, current.node]
        })) || [])
      )
      if ((current.node.next?.length || 0) === 0) {
        ret.push([...current.acc, current.node])
      }
    }
  }
  return ret
}

const createScenarios = (nodes: ParsedNode[]) => {
  const ignore = ['gateway', 'connector', 'start', 'userAction']
  const given: { text: string; type: string; value?: string }[] = []
  const then: { text: string; type: string }[] = []
  for (const node of nodes.filter((n) => !!n.meta)) {
    if (!ignore.includes(node.meta!.type))
      then.push({ type: node.meta!.type, text: node.meta?.text! })
    else if (node.meta!.type === 'connector' && node.meta!.text)
      given.push({
        type: node.meta!.type,
        text: node.meta?.text!,
        value: node.meta?.value
      })
  }
  return {
    given,
    then
  }
}

export type Feature = ReturnType<typeof createFeature>
export const createFeature = (name: string, nodes: ParsedNode[][], tables: ParsedTable[]) => ({
  name,
  scenarios: nodes?.map((n) => createScenarios(n)),
  tables
})
