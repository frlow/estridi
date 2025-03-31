import { Scraped, ScrapedStart } from '../scraped'

function areArraysEqual(array1: string[], array2: string[]): boolean {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  )
}

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
}

export type NodeTree = {
  name: string
  children: (
    | {
        name: string
        gateways: Record<string, string>
        actions: string[]
      }
    | NodeTree
  )[]
}

export const getTestableNodeTree2 = (scraped: Scraped): NodeTree => {
  const getCurrentNode = (probe: Probe) =>
    scraped.find((n) => n.id === probe.path[probe.path.length - 1])
  const isNodeInAnotherProbe = (nodeKey: string) =>
    probes.some(
      (p) =>
        getAllNodeKeys(p).includes(nodeKey) &&
        ['resting', 'active'].includes(p.state),
    )
  const rootNode: ScrapedStart = scraped.find(
    (n: ScrapedStart) => n.type === 'root',
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
      if (!discoveredNodes[nodeKey])
        discoveredNodes[nodeKey] = structuredClone(probe)
      const currentNode = getCurrentNode(probe)
      if (!currentNode) debugger
      if ('options' in currentNode) {
        probes.splice(probes.indexOf(probe), 1)
        Object.entries(currentNode.options).forEach((option) => {
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
      if ('next' in currentNode) {
        if (
          isNodeInAnotherProbe(getNodeKey(currentNode.next, probe.subprocesses))
        ) {
          probe.state = 'sleeping'
          continue
        }
        if (currentNode.next === undefined) probe.state = 'finished'
        else {
          probe.path.push(currentNode.next)
          probe.state = 'resting'
        }
      }
      if ('link' in currentNode) {
        debugger
      }
    }

    if (probes.every((p) => p.state !== 'resting') && probesToWake.length > 0) {
      probesToWake.forEach((p) => (p.state = 'awake'))
      probesToWake.splice(0, probesToWake.length)
    }
  }
  const testableNodes = Object.values(discoveredNodes)
    .filter((p) =>
      ['script', 'serviceCall'].includes(
        scraped.find((n) => n.id === p.path[p.path.length - 1]).type,
      ),
    )
    .map((p) => {
      const name = scraped.find((n) => n.id === p.path[p.path.length - 1]).raw
      return {
        name,
        gateways: p.gateways,
        actions: p.actions,
        subprocesses: p.subprocesses,
      }
    })

  debugger
}
