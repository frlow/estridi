import { ScrapedNode } from '../../scraped'
import { UniqueRecord } from './index'
import { addProbePath, getNodeKey, isNodeInAnotherProbe, Probe } from './probe'

export function handleLoop(currentNode: ScrapedNode, probe: Probe) {
  if (currentNode.type === 'loop') {
    if (probe.path.filter((id) => id === currentNode.id).length >= 2) {
      probe.state = 'finished'
      return
    }
  }
}

export function handleGateway(
  currentNode: ScrapedNode,
  allGateways: UniqueRecord,
  probes: Probe[],
  probe: Probe,
  probesAvailableToWake: Probe[],
) {
  if ('options' in currentNode) {
    if (currentNode.type === 'gateway') allGateways[currentNode.raw] = null
    probes.splice(probes.indexOf(probe), 1)
    Object.entries(currentNode.options).forEach((option) => {
      if (
        isNodeInAnotherProbe(getNodeKey(option[0], probe.subprocesses), probes)
      )
        return
      if (
        currentNode.type === 'gateway' &&
        probe.gateways[currentNode.raw] &&
        probe.gateways[currentNode.raw] !== option[1]
      ) {
        const toWake = probesAvailableToWake.find(
          (p) => p.gateways[currentNode.raw] == option[1],
        )
        if (toWake) {
          toWake.state = 'resting'
          probesAvailableToWake.splice(probesAvailableToWake.indexOf(toWake), 1)
        }
        return
      }
      const newProbe = structuredClone(probe)
      newProbe.state = 'resting'
      addProbePath(newProbe, option[0])
      if (currentNode.type === 'gateway')
        newProbe.gateways[currentNode.raw] = option[1]
      probes.push(newProbe)
    })
    probe.state = 'removed'
  }
}
