import { test } from 'vitest'
import scraped from '../../../output/scraped.json'
import { getTestData } from './testData'

test('testData', () => {
  const testData = getTestData(scraped)
  console.log(testData)
  const messages = testData.filter(n => n.type === 'message')
  console.log(messages)
  debugger
})
