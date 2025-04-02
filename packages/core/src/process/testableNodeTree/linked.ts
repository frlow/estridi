import { ScrapedNode } from '../../scraped'
import { Probe } from './probe'

export function handleLinkedSubprocess(
  currentNode: ScrapedNode,
  probe: Probe,
  probes: Probe[],
) {
  if ('link' in currentNode && currentNode.link) {
    const linkLoopCount = probe.subprocesses.filter(
      (id) => id == currentNode.id,
    ).length
    if (linkLoopCount < 1) {
      const newProbe = structuredClone(probe)
      newProbe.state = 'resting'
      newProbe.path.push(currentNode.link)
      newProbe.subprocesses.push(currentNode.id)
      probes.push(newProbe)
    }
  }
}
