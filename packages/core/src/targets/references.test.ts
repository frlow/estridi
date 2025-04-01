import { describe, test } from 'vitest'
import { getTestCase } from '../test/editorTestCases'
import { getTestableNodeTree } from '../process/testableNodeTree'
import { generatePlaywright } from './playwright'
import { compareToReferenceFile } from '../test/referenceFile'
import { TargetGenerator } from './TargetGenerator'
import { generateVitestUnit } from './vitest-unit'
import { generateVitest } from './vitest'

const testReference =
  (name: string, generatorFunc: TargetGenerator, override: boolean) => async () => {
    const testCase = await getTestCase()
    const nodeTree = getTestableNodeTree(testCase, 'standard')
    const code = await generatorFunc(nodeTree)
    await compareToReferenceFile(name, code, override)
  }

describe('references', () => {
  test('playwright', testReference('playwright', generatePlaywright, false))
  test.skip('vitest', testReference('vitest', generateVitest, false))
  test.skip('vitest-unit', testReference('vitestUnit', generateVitestUnit, false))
})
