import { ScrapedNode } from '../../scraped'

export type Probe = {
  path: string[]
  gateways: Record<string, string>
  actions: string[]
  subprocesses: string[]
  state: 'awake' | 'sleeping' | 'resting' | 'finished' | 'removed'
  testName?: string
}

export function handleProbeFinished(currentNode: ScrapedNode, probe: Probe) {
  if (probe.state === 'awake') probe.state = 'finished'
  if (
    !(
      'options' in currentNode && Object.keys(currentNode.options).length > 0
    ) &&
    !(
      'actions' in currentNode && Object.keys(currentNode.actions).length > 0
    ) &&
    !('link' in currentNode && !!currentNode.link) &&
    !('next' in currentNode && !!currentNode.next)
  )
    probe.state = 'finished'
}

function getAllNodeKeys(probe: Probe) {
  return probe.path.map((id) => [...probe.subprocesses, id].join('|'))
}

export const isNodeInAnotherProbe = (nodeKey: string, probes: Probe[]) =>
  probes.some(
    (p) =>
      getAllNodeKeys(p).includes(nodeKey) &&
      ['resting', 'active'].includes(p.state),
  )

export function getNodeKey(id: string, subprocesses: string[]) {
  return [...subprocesses, id].join('|') // probe.path[probe.path.length - 1]
}

export const addProbePath = (probe: Probe, id: string) => {
  if (!id || id === 'undefined') debugger
  probe.path.push(id)
}
