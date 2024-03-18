import { test } from 'vitest'
import scraped from '../../../output/scraped.json'
import { getTestData } from './testData'

test('testData', () => {
  const testData = getTestData(scraped)
  console.log(testData)
  debugger
})
