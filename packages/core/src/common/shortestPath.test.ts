import { describe, expect, test } from 'vitest'
import { findShortestPathToNode } from './shotestPath'
import { editorTestCases } from '../test/editorTestCases'
import { injectVirtualNodes } from './virtualNodes'

describe('find shortest path', () => {
  test("shortest path", async ()=>{
    const testCase = editorTestCases.shortestpathBase
    const scriptNode = testCase.find(n => n.text === 'My node')
    const path = findShortestPathToNode(testCase, scriptNode.id)
    const shortestPathNode = path.find(n=>n.text==="Shortest Path")
    expect(shortestPathNode).toBeTruthy()
  })

  test('virtual nodes should skip ahead one', async () => {
    const testCase = editorTestCases.shortestpathVirtual
    const scriptNode = testCase.find(n => n.text === 'My node')
    const injected = await injectVirtualNodes(testCase)
    const path = findShortestPathToNode(injected, scriptNode.id)
    const virtualNode = path.find(n=>n.variant==="virtual")
    expect(virtualNode).toBeTruthy()
  })
})
