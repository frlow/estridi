import { describe, test } from 'vitest'
import { getTestCase } from '../test/editorTestCases'
import { getTestableNodeTree2 } from './testableNodeTree2'

describe('testable node tree 2', () => {
  test('default case', async () => {
    const testCase = await getTestCase('standard')
    const tree = getTestableNodeTree2(testCase)
    debugger
  })
})
