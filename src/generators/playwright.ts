import { Scraped } from '../common'
import { GenerationResult } from './index'
import { getTestData } from './utils/testData'

export const generatePlaywrightTests = (scraped: Scraped): GenerationResult[] => {
  const testData = getTestData(scraped)
  const messages = testData.filter(n => n.type === 'message')
  return []
}
