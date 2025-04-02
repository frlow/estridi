import { ScrapedNode } from '../../scraped'

export type Probe = {
  path: string[]
  gateways: Record<string, string>
  actions: string[]
  subprocesses: string[]
  state: 'awake' | 'sleeping' | 'resting' | 'finished'
  testName?: string
}

export function handleProbeFinished(
  currentNode: ScrapedNode,
  probe: Probe,
) {
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
