import { writeAllFiles } from '../utils/files.js'
import { Scraped } from '../common.js'
import { generatePlaywrightTests } from './playwright.js'
import path from 'node:path'
import { generateVitestTests } from './vitest.js'

export const modes = ['playwright', 'vitest'] as const
export type Mode = typeof modes[number];
export const generateAll = (scraped: Scraped, mode: Mode) => {
  const targetDir = 'tests'
  const roots = scraped.filter(node => node.type === 'start' && node.text.startsWith('root:'))
  if (roots.length === 0) {
    console.warn('No root nodes fond!')
    return
  }
  for (const root of roots) {
    const name = root.text.split(':')[1]
    if (mode === 'playwright') writeAllFiles(generatePlaywrightTests(scraped, targetDir, root.id, name))
    if (mode === 'vitest') writeAllFiles(generateVitestTests(scraped, targetDir, root.id, name))
    writeAllFiles([{
      file: path.join(targetDir, 'scraped.json'),
      overwrite: true,
      content: JSON.stringify(scraped, null, 2)
    }])
  }
}
