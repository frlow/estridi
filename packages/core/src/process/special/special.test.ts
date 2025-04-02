import { describe, expect, test } from 'vitest'
import { getTestCase } from '../../test/editorTestCases'
import { injectSpecialCases } from './index'
import { getTestableNodeTree } from '../testableNodeTree'

const createTest = (rootName: string) => async () => {
  const originalKey = `tc-tree-${rootName}`
  const refKey = `tc-tree-${rootName}-ref`
  const getTree = async (key: string) => {
    const testCase = await getTestCase(key)
    const injected = injectSpecialCases(testCase)
    return getTestableNodeTree(injected, key)
  }
  const original = await getTree(originalKey)
  const referenceJSON = JSON.stringify(await getTree(refKey))
  const reference = JSON.parse(referenceJSON
    .replaceAll('-ref-sub', '')
    .replaceAll('-ref', '')
  )
  expect(original).toEqual(reference)
}

describe('inject special transformations', () => {
  describe('virtual nodes', () => {
    test('base', createTest('virtual'))
  })

  describe('subprocess', () => {
    test('subprocess with table linked by :', createTest('table'))
  })
})
