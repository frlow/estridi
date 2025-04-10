import { NodeLeaf, NodeTree, UniqueRecord } from './index'
import { Scraped, ScrapedStart } from '../../scraped'
import { Probe } from './probe'

export type FlatNodeTree = {
  name: string
  gateways: Record<string, string>
  actions: string[]
  subprocesses: string[]
  path: string[]
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
        path: p.path,
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
  subprocesses,
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
  const namedPaths: { key: string; namedKey: string; path: string[] }[] = []
  const getLeafPath = (path: string[]): NodeLeaf['path'] => {
    const pathNodes = path.map((p) => scraped.find((n) => n.id === p))
    return pathNodes.reduce((acc, cur, index, arr) => {
      if (cur.type === 'userAction')
        acc.push({
          raw: cur.actions[arr[index + 1].id],
          type: 'action',
        })
      else if(cur.type==="gateway")
        acc.push({
          raw: cur.raw,
          value: cur.options[arr[index + 1].id],
          type: 'gateway',
        })
      else if(cur.type==="serviceCall")
        acc.push({
          raw: cur.raw,
          type: 'serviceCall',
        })
      return acc
    }, [])
  }
  const getNamedPath = (subprocesses: string[]) => {
    const key = subprocesses.join('|')
    const existing = namedPaths.find((n) => n.key === key)
    if (existing) return existing.path
    const path = subprocesses.map((id) => scraped.find((n) => n.id === id).raw)
    const namedKey = path.join('|')
    if (namedPaths.some((n) => n.namedKey === namedKey)) {
      let count = 1
      while (true) {
        const updatedPath = structuredClone(path)
        updatedPath[path.length - 1] =
          `${updatedPath[path.length - 1]} ${count++}`
        const updatedNamedKey = updatedPath.join('|')
        if (namedPaths.some((n) => n.namedKey === updatedNamedKey)) continue
        const newNamedPath = {
          key,
          namedKey: updatedNamedKey,
          path: updatedPath,
        }
        namedPaths.push(newNamedPath)
        return updatedPath
      }
    }
    const newNamedPath = { key, namedKey, path }
    namedPaths.push(newNamedPath)
    return path
  }
  const tree: NodeTree = nodes.reduce(
    (acc, cur) => {
      const namedPath = getNamedPath(cur.subprocesses)
      const currentSubprocess = namedPath.reduce((_acc, _cur) => {
        let subprocessChild = _acc.children.find((s) => s.name === _cur)
        if (!subprocessChild) {
          subprocessChild = { name: _cur, children: [] }
          _acc.children.push(subprocessChild)
        }
        return subprocessChild
      }, acc)
      const leaf: NodeLeaf = {
        path: getLeafPath(cur.path),
        name: cur.name,
        actions: cur.actions,
        gateways: cur.gateways,
      }
      const sameNameCount = currentSubprocess.children.filter(
        (c) => c.name === leaf.name,
      ).length
      if (sameNameCount > 0) leaf.index = sameNameCount
      currentSubprocess.children.push(leaf)
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
