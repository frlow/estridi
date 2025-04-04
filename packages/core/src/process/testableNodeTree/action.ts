import { ScrapedNode } from '../../scraped'
import { UniqueRecord } from './index'
import { addProbePath, Probe } from './probe'

export function handleAction(
  currentNode: ScrapedNode,
  probes: Probe[],
  probe: Probe,
  getSubprocess: (probeSubprocesses: string[]) => {
    name: string
    actions: UniqueRecord
    tests: UniqueRecord
    serviceCalls: UniqueRecord
  },
) {
  if (currentNode.type === 'userAction') {
    Object.entries(currentNode.actions).forEach((action) => {
      getSubprocess(probe.subprocesses).actions[action[1]] = null
      const newProbe = structuredClone(probe)
      newProbe.state = 'resting'
      addProbePath(newProbe, action[0])
      newProbe.actions.push(action[1])
      probes.push(newProbe)
    })
  }
}
