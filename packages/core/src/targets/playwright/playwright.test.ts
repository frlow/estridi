import { describe, expect, test } from 'vitest'
import {
  figmaConnectorNode,
  figmaNodes,
  figmaTable,
  getBaseFigmaNode,
  getFigmaDocument,
  getFigmaTestData
} from '../../sources/test/figmaGenerator.js'
import { processFigma } from '../../sources/figma.js'
import fs from 'node:fs'
import path from 'node:path'
import { filterScraped } from '../../common/filter.js'
import { generatePlaywright } from './index.js'

describe('playwright', () => {
  test('generated code should match reference', async () => {
    const scraped = filterScraped(await processFigma(getFigmaTestData()), 'main')
    const code = await generatePlaywright('main', scraped)
    const filePath = path.join(__dirname, '../test', 'playwrightReference.spec.ts')
    fs.writeFileSync(filePath, code, 'utf8')
    const reference = fs.readFileSync(filePath, 'utf8')
    expect(code).toStrictEqual(reference)
  })

  test('loop should not crash', async () => {
    const document = getFigmaDocument('loop')
    const processed = await processFigma(document)
    const scraped = filterScraped(processed, 'loop')
    const code = await generatePlaywright('main', scraped)
    expect(code).toBeTruthy
  })

  test('subprocess loop should not crash', async () => {
    const document = getFigmaDocument('subprocess-loop')
    const processed = await processFigma(document)
    const scraped = filterScraped(processed, 'test')
    const code = await generatePlaywright('main', scraped)
    expect(code).toBeTruthy
  })

  test('illegal characters in tables', async () => {
    const scraped = await processFigma(
      getBaseFigmaNode([
        ...figmaNodes.start({ id: 'startId' }),
        ...figmaConnectorNode({ text: 'root:demo', start: 'startId', end: 'TableSubprocessId' }),
        ...figmaNodes.subprocess({ text: 'Validate: My Table', id: 'TableSubprocessId' }),
        ...figmaTable({
          children: [
            ['My Table', 'Content'],
            ['Line 1', `/^[a-zåäöüA-ZÅÄÖÜ0-9!&*);\\-/,%:'="$(+. §?]{0,30}$/`]
          ]
        })
      ])
    )

    const filtered = filterScraped(scraped, 'demo')
    const code = await generatePlaywright('main', filtered)
    const offendingLine = code.split('\n').find(line=>line.includes("\"Content\":")).trim()
    expect(offendingLine).toEqual(`"Content": "/^[a-zåäöüA-ZÅÄÖÜ0-9!&*);\\\\-/,%:'=\\"$(+. §?]{0,30}$/"`)
  })
})

