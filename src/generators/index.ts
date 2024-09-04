import { writeAllFiles } from '../utils/files.js'
import { EstridiConfig, Scraped, scrapedFile } from '../common.js'
import { generatePlaywrightTests } from './playwright.js'
import * as path from 'node:path'
import { generateVitestTests } from './vitest.js'

export const modes = ['playwright', 'vitest', 'scraped'] as const
export type Mode = typeof modes[number];
export const generateAll = (scraped: Scraped, config: EstridiConfig) => {
  const targetDir = 'tests'
  const roots = scraped.filter(node => {
    const isRoot = node.type === 'start' && node.text.startsWith('root:')
    const allowedRoot =
      !config.rootNames || // No rootNames (allow only one)
      config.rootNames === '*' || // Wildcard, allow all
      config.rootNames.split(',').includes(node.text.replace('root:', '')) // Filter by names
    return isRoot && allowedRoot
  })
  if (roots.length === 0) {
    console.warn('No root nodes found!')
    return
  } else if (roots.length > 1 && !config.rootNames) {
    console.warn('Specify rootNames "*" to generate all root nodes')
    return
  }

  for (const root of roots) {
    const name = root.text.split(':')[1]
    if (config.mode === 'playwright') writeAllFiles(generatePlaywrightTests(scraped, targetDir, root.id, name))
    if (config.mode === 'vitest') writeAllFiles(generateVitestTests(scraped, targetDir, root.id, name))
    writeAllFiles([{
      file: path.join(targetDir, scrapedFile),
      overwrite: true,
      content: JSON.stringify(scraped, null, 2)
    }])
  }
}
