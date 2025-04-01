import { Scraped, ScrapedStart, ScrapedTable } from '../scraped'

function getNodeKey(id: string, subprocesses: string[]) {
  return [...subprocesses, id].join('|') // probe.path[probe.path.length - 1]
}

function getAllNodeKeys(probe: Probe) {
  return probe.path.map((id) => [...probe.subprocesses, id].join('|'))
}

export type Probe = {
  path: string[]
  gateways: Record<string, string>
  actions: string[]
  subprocesses: string[]
  state: 'awake' | 'sleeping' | 'resting' | 'finished'
  testName?: string
}

export type SubprocessDefinition = {
  actions: string[]
  tests: string[]
  serviceCalls: string[]
}

export type NodeLeaf = {
  name: string
  gateways: Record<string, string>
  actions: string[]
}

export type NodeBranch = {
  name: string
  children: (NodeLeaf | NodeBranch)[]
}

export type NodeTree = {
  allGateways?: string[]
  allServiceCalls?: string[]
  subprocesses?: Record<string, SubprocessDefinition>
} & NodeBranch

export type UniqueRecord = Record<string, null>

export const getTestableNodeTree = (
  scraped: Scraped,
  rootName: string,
): NodeTree => {
  const allGateways: UniqueRecord = {}
  const allServiceCalls: UniqueRecord = {}
  const subprocesses: Record<
    string,
    {
      name: string
      actions: UniqueRecord
      tests: UniqueRecord
      serviceCalls: UniqueRecord
    }
  > = {}
  const getCurrentNode = (probe: Probe) =>
    scraped.find((n) => n.id === probe.path[probe.path.length - 1])
  const isNodeInAnotherProbe = (nodeKey: string) =>
    probes.some(
      (p) =>
        getAllNodeKeys(p).includes(nodeKey) &&
        ['resting', 'active'].includes(p.state),
    )
  const getSubprocess = (probeSubprocesses: string[]) => {
    const keyProcesses = [rootNode.id, ...probeSubprocesses]
    const key = keyProcesses.join('|')
    const subProcess = scraped.find(
      (n) => n.id === keyProcesses[keyProcesses.length - 1],
    )
    if (!subprocesses[key])
      subprocesses[key] = {
        actions: {},
        serviceCalls: {},
        tests: {},
        name: subProcess.type === 'root' ? 'root' : subProcess.raw,
      }
    return subprocesses[key]
  }
  const rootNode: ScrapedStart = scraped.find(
    (n: ScrapedStart) => n.type === 'root' && n.raw === rootName,
  ) as ScrapedStart
  const discoveredNodes: Record<string, Probe> = {}
  const probes: Probe[] = [
    {
      actions: [],
      gateways: {},
      path: [rootNode.id],
      subprocesses: [],
      state: 'awake',
    },
  ]
  const probesToWake: Probe[] = []
  while (probes.some((p) => ['awake', 'resting'].includes(p.state))) {
    probes
      .filter((p) => p.state === 'resting')
      .forEach((p) => (p.state = 'awake'))
    while (probes.some((p) => p.state === 'awake')) {
      const probe = probes.find((p) => p.state === 'awake')
      const nodeKey = getNodeKey(
        probe.path[probe.path.length - 1],
        probe.subprocesses,
      )
      const currentNode = getCurrentNode(probe)
      if (!discoveredNodes[nodeKey]) {
        const probeClone = structuredClone(probe)
        if (['script', 'serviceCall'].includes(currentNode.type))
          probeClone.testName = currentNode.raw
        discoveredNodes[nodeKey] = probeClone
      }
      if (!currentNode) debugger
      if (currentNode.type === 'serviceCall') {
        allServiceCalls[currentNode.raw] = null
        getSubprocess(probe.subprocesses).serviceCalls[currentNode.raw] = null
        getSubprocess(probe.subprocesses).tests[currentNode.raw] = null
      }
      if (currentNode.type === 'script')
        getSubprocess(probe.subprocesses).tests[currentNode.raw] = null
      if ('options' in currentNode && currentNode.variant === 'gateway') {
        allGateways[currentNode.raw] = null
        probes.splice(probes.indexOf(probe), 1)
        Object.entries(currentNode.options).forEach((option) => {
          if (probe.path.includes(option[0])) return
          if (
            probe.gateways[currentNode.raw] &&
            probe.gateways[currentNode.raw] !== option[1]
          ) {
            const toWake = probes.find(
              (p) =>
                p.state === 'sleeping' &&
                p.gateways[currentNode.raw] == option[1],
            )
            if (toWake) probesToWake.push(toWake)
            return
          }
          const newProbe = structuredClone(probe)
          newProbe.state = 'resting'
          newProbe.path.push(option[0])
          newProbe.gateways[currentNode.raw] = option[1]
          probes.push(newProbe)
        })
      }
      if ('options' in currentNode && currentNode.variant === 'loop') {
        if (Object.keys(currentNode.options).length !== 1)
          throw 'Loop can only have one out path'
        probe.path.push(Object.keys(currentNode.options)[0])
        probe.state = 'resting'
      }
      if ('actions' in currentNode) {
        probes.splice(probes.indexOf(probe), 1)
        Object.entries(currentNode.actions).forEach((action) => {
          getSubprocess(probe.subprocesses).actions[action[1]] = null
          const newProbe = structuredClone(probe)
          newProbe.state = 'resting'
          newProbe.path.push(action[0])
          newProbe.actions.push(action[1])
          probes.push(newProbe)
        })
      }
      if ('next' in currentNode) {
        if (
          isNodeInAnotherProbe(getNodeKey(currentNode.next, probe.subprocesses))
        ) {
          probe.state = 'sleeping'
          continue
        } else {
          probe.path.push(currentNode.next)
          probe.state = 'resting'
        }
      }
      if ('link' in currentNode && currentNode.link) {
        const linkLoopCount = probe.subprocesses.filter(
          (id) => id == currentNode.id,
        ).length
        if (linkLoopCount >= 1) {
          probe.state = 'finished'
        } else {
          probe.path.push(currentNode.link)
          probe.subprocesses.push(currentNode.id)
          probe.state = 'resting'
        }
      }
      if ('tableKey' in currentNode && currentNode.tableKey) {
        const table = scraped.find(
          (n) => n.type === 'table' && n.raw === currentNode.tableKey,
        ) as ScrapedTable
        table.rows.slice(1).forEach((row) => {
          const rowNodeKey = getNodeKey(row[0], [
            ...probe.subprocesses,
            currentNode.id,
          ])
          const probeClone = structuredClone(probe)
          probeClone.subprocesses.push(currentNode.id)
          probeClone.path.push(`${currentNode.id}-${row[0]}`)
          probeClone.gateways[currentNode.raw] = row[0]
          probeClone.testName = `${currentNode.raw} ${row[0]}`
          discoveredNodes[rowNodeKey] = probeClone
        })
      }
      if (
        !(
          'options' in currentNode &&
          Object.keys(currentNode.options).length > 0
        ) &&
        !(
          'actions' in currentNode &&
          Object.keys(currentNode.actions).length > 0
        ) &&
        !('link' in currentNode && !!currentNode.link) &&
        !('next' in currentNode && !!currentNode.next)
      )
        probe.state = 'finished'
    }

    if (probes.every((p) => p.state !== 'resting') && probesToWake.length > 0) {
      probesToWake.forEach((p) => (p.state = 'awake'))
      probesToWake.splice(0, probesToWake.length)
    }
  }
  const testableNodes = Object.values(discoveredNodes)
    .filter((p) => p.testName)
    .map((p) => {
      return {
        name: p.testName,
        gateways: p.gateways,
        actions: p.actions,
        subprocesses: p.subprocesses,
      }
    })
  testableNodes.sort((a, b) => a.subprocesses.length - b.subprocesses.length)

  const tree: NodeTree = testableNodes.reduce(
    (acc, cur) => {
      const currentSubprocess = cur.subprocesses.reduce((_acc, _cur) => {
        const targetSubprocess = scraped.find((n) => n.id === _cur)
        let subprocessChild = _acc.children.find(
          (s) => s.name === targetSubprocess.raw,
        )
        if (!subprocessChild) {
          subprocessChild = { name: targetSubprocess.raw, children: [] }
          _acc.children.push(subprocessChild)
        }
        return subprocessChild
      }, acc)
      currentSubprocess.children.push({
        name: cur.name,
        actions: cur.actions,
        gateways: cur.gateways,
      })
      return acc
    },
    {
      name: rootNode.raw,
      children: [],
    },
  )
  tree.allGateways = Object.keys(allGateways)
  tree.allServiceCalls = Object.keys(allServiceCalls)
  tree.subprocesses = Object.values(subprocesses).reduce(
    (acc, cur) => ({
      ...acc,
      [cur.name]: {
        actions: Object.keys(cur.actions),
        tests: Object.keys(cur.tests),
        serviceCalls: Object.keys(cur.serviceCalls),
      },
    }),
    {},
  )
  return tree
}
