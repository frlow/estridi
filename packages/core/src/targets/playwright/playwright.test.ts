import { describe, expect, test } from 'vitest'
import { generatePlaywright } from './index.js'
import {
  loopTestCase,
  standardTestCase,
  subprocessLoopTestCase,
} from '../../test/testCases'
import path from 'node:path'
import fs from 'node:fs'
import { getTestableNodeTree } from '../../process/testableNodeTree'
import { prettifyCode } from '../../texts'
import { getTestCase } from '../../test/editorTestCases'

describe('playwright', () => {
  test('generate playwright test code', async () => {
    const testCase = await getTestCase()
    const nodeTree = getTestableNodeTree(testCase, 'standard')
    const code = await generatePlaywright(nodeTree)
    const prettyCode = await prettifyCode(code)
    const filePath = path.join(
      __dirname,
      '../../test',
      'playwrightReference.ts',
    )
    const referenceFileContent = `// @ts-nocheck\n${prettyCode}`
    fs.writeFileSync(filePath, referenceFileContent, 'utf8')
    const reference = fs.readFileSync(filePath, 'utf8')
    const normalizeLineEndings = (str, normalized = '\n') =>
      str.replace(/\r?\n/g, normalized)
    expect(normalizeLineEndings(referenceFileContent)).toStrictEqual(
      normalizeLineEndings(reference),
    )
  })

  test('loop should not crash', async () => {
    const nodeTree = getTestableNodeTree(loopTestCase, 'loop')
    const code = await generatePlaywright(nodeTree)
    expect(code).toBeTruthy
  })

  test('subprocess loop should not crash', async () => {
    const nodeTree = getTestableNodeTree(subprocessLoopTestCase, 'subloop')
    const code = await generatePlaywright(nodeTree)
    expect(code).toBeTruthy
  })
})
