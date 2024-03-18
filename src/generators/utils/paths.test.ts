import { test } from 'vitest'
import { findAllPaths } from './paths'
import scraped from '../../../output/scraped.json'

test('paths', () => {
  const allPaths = findAllPaths(scraped)
  console.log(allPaths)
  debugger
})
