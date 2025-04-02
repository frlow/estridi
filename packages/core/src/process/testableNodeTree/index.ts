import { Scraped, ScrapedStart } from '../../scraped'
import { getNodeTree, getTestableNodes } from './nodeTree'
import { getNodeKey, handleProbeFinished, isNodeInAnotherProbe, Probe } from './probe'
import { handleGateway, handleLoop } from './gateway'
import { handleAction } from './action'
import { handleLinkedSubprocess } from './linked'





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
  const probesAvailableToWake: Probe[] = []
  // Loop over all probes that are still active (awake or resting)
  while (probes.some((p) => ['awake', 'resting'].includes(p.state))) {
    // Wake all resting probes
    probes
      .filter((p) => p.state === 'resting')
      .forEach((p) => (p.state = 'awake'))
    while (probes.some((p) => p.state === 'awake')) {
      // Find first awake probe
      const probe = probes.find((p) => p.state === 'awake')
      const nodeKey = getNodeKey(
        probe.path[probe.path.length - 1],
        probe.subprocesses,
      )
      const currentNode = getCurrentNode(probe)
      if (!currentNode) {
        debugger
        throw 'node not found'
      }

      // Save new nodes
      if (!discoveredNodes[nodeKey]) {
        const probeClone = structuredClone(probe)
        if (['script', 'serviceCall'].includes(currentNode.type)) {
          probeClone.testName = currentNode.raw
        }
        discoveredNodes[nodeKey] = probeClone
      }

      // Make note of service calls
      if (currentNode.type === 'serviceCall') {
        allServiceCalls[currentNode.raw] = null
        getSubprocess(probe.subprocesses).serviceCalls[currentNode.raw] = null
        getSubprocess(probe.subprocesses).tests[currentNode.raw] = null
      }

      // Make note of scrips
      if (currentNode.type === 'script')
        getSubprocess(probe.subprocesses).tests[currentNode.raw] = null

      handleGateway(
        currentNode,
        allGateways,
        probes,
        probe,
        probesAvailableToWake,
      )
      handleLoop(currentNode, probe)
      handleAction(currentNode, probes, probe, getSubprocess)
      handleLinkedSubprocess(currentNode, probe, probes)

      // Handle next
      if ('next' in currentNode && currentNode.next) {
        if (
          isNodeInAnotherProbe(getNodeKey(currentNode.next, probe.subprocesses), probes)
        ) {
          probe.state = 'sleeping'
          probesAvailableToWake.push(probe)
          continue
        } else {
          probe.path.push(currentNode.next)
          probe.state = 'resting'
        }
      }

      handleProbeFinished(currentNode, probe)
    }
    //
    // // Wake probes in wake list
    // if (probes.every((p) => p.state !== 'resting') && probesToWake.length > 0) {
    //   probesToWake.forEach((p) => (p.state = 'awake'))
    //   probesToWake.splice(0, probesToWake.length)
    // }
  }

  // Get list of testable nodes
  const testableNodes = getTestableNodes(discoveredNodes)

  // Get testable node tree
  return getNodeTree({
    scraped,
    nodes: testableNodes,
    rootNode,
    subprocesses,
    allServiceCalls,
    allGateways,
  })
}
