import { describe, expect, test } from 'vitest'
import { processFigma } from '../../sources/figma.js'
import { filterScraped } from '../../common/filter.js'
import { generatePlaywright } from './index.js'
import { autoText, loopTestCase, subprocessLoopTestCase } from '../../sources/testCases'

describe('playwright', () => {
  // test('generated code should match reference', async () => {
  //   const scraped = filterScraped(await processFigma(getFigmaTestData()), 'main')
  //   const code = await generatePlaywright('main', scraped)
  //   const filePath = path.join(__dirname, '../test', 'playwrightReference.spec.ts')
  //   fs.writeFileSync(filePath, code, 'utf8')
  //   const reference = fs.readFileSync(filePath, 'utf8')
  //   expect(code).toStrictEqual(reference)
  // })

  test('loop should not crash', async () => {
    const code = await generatePlaywright('main', loopTestCase)
    expect(code).toBeTruthy
  })

  test('subprocess loop should not crash', async () => {
    const code = await generatePlaywright('main', subprocessLoopTestCase)
    expect(code).toBeTruthy
  })

  test('illegal characters in tables', async () => {
    const scraped: Scraped = [{
      id: 'startId',
      type: 'root',
      next: 'TableSubprocessId',
      ...autoText('demo')
    },
      {
        id: 'TableSubprocessId',
        type: 'subprocess',
        ...autoText('Validate: My Table'),
        tableKey: "My Table"
      },
      {
        id: 'TableId',
        ...autoText('My Table'),
        type: 'table',
        rows: [
          ['My Table', 'Content'],
          ['Line 1', `/^[a-zåäöüA-ZÅÄÖÜ0-9!&*);\\-/,%:'="$(+. §?]{0,30}$/`]
        ]
      }]

    const filtered = filterScraped(scraped, 'demo')
    const code = await generatePlaywright('main', filtered)
    const offendingLine = code.split('\n').find(line => line.includes('"Content":')).trim()
    expect(offendingLine).toEqual(`"Content": "/^[a-zåäöüA-ZÅÄÖÜ0-9!&*);\\\\-/,%:'=\\"$(+. §?]{0,30}$/"`)
  })
})

