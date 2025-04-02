import { NodeTree, UniqueRecord } from './index'
import { Scraped, ScrapedStart } from '../../scraped'
import { Probe } from './probe'

export type FlatNodeTree = {
  name: string
  gateways: Record<string, string>
  actions: string[]
  subprocesses: string[]
}[]

export function getTestableNodes(discoveredNodes: Record<string, Probe>) {
  const testableNodes = Object.values(discoveredNodes)
    .filter((p) => p.testName)
    .map((p) => {
      return {
        name: p.testName,
        gateways: p.gateways,
        actions: p.actions,
        subprocesses: p.subprocesses,
      }
    })
  testableNodes.sort((a, b) => a.subprocesses.length - b.subprocesses.length)
  return testableNodes
}

export const getNodeTree = ({
  nodes,
  scraped,
  allGateways,
  allServiceCalls,
  rootNode,
  subprocesses
}: {
  nodes: FlatNodeTree
  scraped: Scraped
  allGateways: UniqueRecord
  allServiceCalls: UniqueRecord
  subprocesses: Record<
    string,
    {
      name: string
      actions: UniqueRecord
      tests: UniqueRecord
      serviceCalls: UniqueRecord
    }
  >
  rootNode: ScrapedStart
}) => {
  const tree: NodeTree = nodes.reduce(
    (acc, cur) => {
      const currentSubprocess = cur.subprocesses.reduce((_acc, _cur) => {
        const targetSubprocess = scraped.find((n) => n.id === _cur)
        let subprocessChild = _acc.children.find(
          (s) => s.name === targetSubprocess.raw,
        )
        if (!subprocessChild) {
          subprocessChild = { name: targetSubprocess.raw, children: [] }
          _acc.children.push(subprocessChild)
        }
        return subprocessChild
      }, acc)
      currentSubprocess.children.push({
        name: cur.name,
        actions: cur.actions,
        gateways: cur.gateways,
      })
      return acc
    },
    {
      name: rootNode.raw,
      children: [],
    },
  )
  tree.allGateways = Object.keys(allGateways)
  tree.allServiceCalls = Object.keys(allServiceCalls)
  tree.subprocesses = Object.values(subprocesses).reduce(
    (acc, cur) => ({
      ...acc,
      [cur.name]: {
        actions: Object.keys(cur.actions),
        tests: Object.keys(cur.tests),
        serviceCalls: Object.keys(cur.serviceCalls),
      },
    }),
    {},
  )
  return tree
}
