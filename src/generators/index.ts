import { writeAllFiles } from '../utils/files.js'
import { GenerationResult, Scraped } from '../common.js'
import { generatePlaywrightTests } from './playwright.js'
import path from 'node:path'

export const generateAll = (scraped: Scraped) => {
  const targetDir = 'tests'
  const roots = scraped.filter(node => node.type === 'start' && node.text.startsWith('root:'))
  if (roots.length === 0) {
    console.warn('No root nodes fond!')
    return
  }
  for (const root of roots) {
    const name = root.text.split(':')[1]
    const playwright = generatePlaywrightTests(scraped, targetDir, root.id, name)
    const json: GenerationResult = {
      file: path.join(targetDir, 'scraped.json'),
      overwrite: true,
      content: JSON.stringify(scraped, null, 2)
    }
    writeAllFiles([...playwright, json])
  }
}
