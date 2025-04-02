import { ScrapedNode } from '../../scraped'
import { UniqueRecord } from './index'
import { Probe } from './probe'

export function handleAction(
  currentNode:ScrapedNode,
  probes: Probe[],
  probe: Probe,
  getSubprocess: (probeSubprocesses: string[]) => {
    name: string
    actions: UniqueRecord
    tests: UniqueRecord
    serviceCalls: UniqueRecord
  },
) {
  if ('actions' in currentNode) {
    Object.entries(currentNode.actions).forEach((action) => {
      getSubprocess(probe.subprocesses).actions[action[1]] = null
      const newProbe = structuredClone(probe)
      newProbe.state = 'resting'
      newProbe.path.push(action[0])
      newProbe.actions.push(action[1])
      probes.push(newProbe)
    })
  }
}
