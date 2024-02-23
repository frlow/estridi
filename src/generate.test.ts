import { test } from 'vitest'
import { testData } from './testData'
import { generate } from './generate'

test('demo', () => {
  generate(testData)
})
