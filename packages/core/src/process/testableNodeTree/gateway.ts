import { ScrapedNode } from '../../scraped'
import { UniqueRecord } from './index'
import { Probe } from './probe'

export function handleLoop(
  currentNode:ScrapedNode,
  probe: Probe,
) {
  if ('options' in currentNode && currentNode.variant === 'loop') {
    if (Object.keys(currentNode.options).length !== 1)
      throw 'Loop can only have one out path'
    probe.path.push(Object.keys(currentNode.options)[0])
    probe.state = 'resting'
  }
}

export function handleGateway(
  currentNode:ScrapedNode,
  allGateways: UniqueRecord,
  probes: Probe[],
  probe: Probe,
  probesToWake: Probe[],
) {
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
            p.state === 'sleeping' && p.gateways[currentNode.raw] == option[1],
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
}
