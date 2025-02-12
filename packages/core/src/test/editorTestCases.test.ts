import { describe, test } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { processTldraw } from '../sources/tldraw'
import { filterScraped } from '../common/filter'
import { parseRootNames } from '../index'
import { format } from 'prettier'

describe('test cases from editor', () => {
  const serverDataPath = path.join(import.meta.dirname, '..', '..', '..', 'editor', 'server', 'data.json')
  const savedDataPath = path.join(import.meta.dirname, 'editor-data.json')
  test.skip('import cases', async () => {
    const raw = fs.readFileSync(serverDataPath, 'utf8')
    const data = JSON.parse(raw)
    const scraped = await processTldraw(data)
    const rootNames = parseRootNames(scraped, '+')
    const cases = rootNames.map(name => ({ name, code: filterScraped(scraped, name) }))
    const code = `import { Scraped } from '../scraped'

export const editorTestCases = {
      ${cases.map(c => `${c.name}: ${JSON.stringify(c.code, null, 2)} as Scraped`).join(',\n')}
    } as const`
    fs.writeFileSync(savedDataPath, raw, 'utf8')
    const formattedCode = await format(code, { parser: 'typescript' })
    fs.writeFileSync(path.join(import.meta.dirname, 'editorTestCases.ts'), formattedCode, 'utf8')
  })

  test.skip('export cases', async () => {
    fs.writeFileSync(serverDataPath, fs.readFileSync(savedDataPath, 'utf-8'), 'utf-8')
  })
})
