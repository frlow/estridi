import { describe, expect, test } from 'vitest'
import { getTestCase } from '../../test/editorTestCases'
import { injectSpecialCases } from './index'
import { getTestableNodeTree, NodeTree } from '../testableNodeTree'

const sortTree = (tree: NodeTree)=>{
  tree.children.sort((a,b)=>a.name.localeCompare(b.name))
  tree.subprocesses["root"]?.tests?.sort((a,b)=>a.localeCompare(b))
}

const createTest = (rootName: string) => async () => {
  const originalKey = `tc-special-${rootName}`
  const refKey = `${originalKey}-ref`
  const getTree = async (key: string) => {
    const testCase = await getTestCase(key)
    const injected = injectSpecialCases(testCase)
    return getTestableNodeTree(injected, key)
  }
  const original = await getTree(originalKey)

  const referenceJSON = JSON.stringify(await getTree(refKey))
  const reference = JSON.parse(
    referenceJSON.replaceAll('-ref-sub', '').replaceAll('-ref', ''),
  )
  sortTree(original)
  sortTree(reference)
  expect(original).toEqual(reference)
}

describe('inject special transformations', () => {
  describe('virtual nodes', () => {
    test('base', createTest('virtual'))
    test('double', createTest('virtual-double'))
    test('stair', createTest('virtual-stair'))
    test('wrong path', createTest('virtual-wrong-path'))
  })

  describe('subprocess', () => {
    test('subprocess with table linked by :', createTest('table'))

    test('subprocess with actions', createTest('subprocess-action'))
  })
})
