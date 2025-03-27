import { generatePlaywright } from '../playwright'
import { Scraped } from '../../scraped'
import { EstridiGeneratorOptions } from '../../index'

export const generateVitest = async (
  name: string,
  scraped: Scraped,
  options: EstridiGeneratorOptions,
) => {
  const playwrightTemplate = await generatePlaywright(name, scraped, options)
  const replaced = playwrightTemplate
    .replace(
      "import { test, expect } from '@playwright/test'",
      'import { test, expect, describe } from "vitest"',
    )
    .replace("import type { BrowserContext, Page } from '@playwright/test'", '')
    .replaceAll('test.describe', 'describe')
    .replaceAll(', page: Page, context: BrowserContext', '')
    .replaceAll('page: Page', '')
    .replaceAll('context: BrowserContext', '')
    .replaceAll('{ page, context }', '')
    .replaceAll(', page, context', '')
    .replaceAll(', context, page', '')
    .replaceAll('context, ', '')
    .replaceAll('page, ', '')
  return replaced
}
