import { ScrapedNode } from '../../scraped'
import { Probe } from './probe'

export function handleLinkedSubprocess(
  currentNode: ScrapedNode,
  probe: Probe,
) {
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
}
