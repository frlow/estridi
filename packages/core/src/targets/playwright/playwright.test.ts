import { describe, expect, test } from 'vitest'
import { filterScraped } from '../../common/filter.js'
import { generatePlaywright } from './index.js'
import {
  autoText,
  loopTestCase,
  standardTestCase,
  subprocessLoopTestCase,
} from '../../test/testCases'
import path from 'node:path'
import fs from 'node:fs'
import { Scraped } from '../../scraped'

describe('playwright', () => {
  test('generate playwright test code', async () => {
    const code = await generatePlaywright('main', standardTestCase, {})
    const filePath = path.join(
      __dirname,
      '../../test',
      'playwrightReference.ts',
    )
    const referenceFileContent = `// @ts-nocheck\n${code}`
    // fs.writeFileSync(filePath, referenceFileContent, 'utf8')
    const reference = fs.readFileSync(filePath, 'utf8')
    const normalizeLineEndings = (str, normalized = '\n') =>
      str.replace(/\r?\n/g, normalized)
    expect(normalizeLineEndings(referenceFileContent)).toStrictEqual(
      normalizeLineEndings(reference),
    )
  })

  test('loop should not crash', async () => {
    const code = await generatePlaywright('main', loopTestCase, {})
    expect(code).toBeTruthy
  })

  test('subprocess loop should not crash', async () => {
    const code = await generatePlaywright('main', subprocessLoopTestCase, {})
    expect(code).toBeTruthy
  })

  test.skip('illegal characters in tables', async () => {
    const scraped: Scraped = [
      {
        id: 'startId',
        type: 'root',
        next: 'TableSubprocessId',
        ...autoText('demo'),
      },
      {
        id: 'TableSubprocessId',
        type: 'subprocess',
        ...autoText('Validate: My Table'),
        tableKey: 'My Table',
      },
      {
        id: 'TableId',
        ...autoText('My Table'),
        type: 'table',
        rows: [
          ['My Table', 'Content'],
          ['Line 1', `/^[a-zåäöüA-ZÅÄÖÜ0-9!&*);\\-/,%:'="$(+. §?]{0,30}$/`],
        ],
      },
    ]

    const filtered = filterScraped(scraped, 'demo')
    const code = await generatePlaywright('main', filtered, {})
    const offendingLine = code
      .split('\n')
      .find((line) => line.includes('"Content":'))
      .trim()
    expect(offendingLine).toEqual(
      `"Content": "/^[a-zåäöüA-ZÅÄÖÜ0-9!&*);\\\\-/,%:'=\\"$(+. §?]{0,30}$/"`,
    )
  })
})
