import { describe, expect, test } from 'vitest'
import { generateVitest } from './vitest'
import testdata from './expected/testdata.json'
import * as path from 'node:path'
import * as fs from 'fs'
import { writeAllFiles } from './files'
import { isInside } from '../figma/traverse'

describe('demo', () => {
  test.skipIf(true)('regerate', () => {
    const files = generateVitest(path.join(__dirname, 'expected', 'vitest'), testdata).map(f => ({
      ...f,
      overwrite: true
    }))
    writeAllFiles(files)
  })
  test('generate files', () => {
    const generated = generateVitest(path.join('expected', 'vitest'), testdata)
    for (const generatedFile of generated) {
      const reference = fs.readFileSync(path.join(__dirname, generatedFile.file), 'utf8')
      expect(generatedFile.content.trim()).toEqual(reference.trim())
    }
  })
})


test('overlap', () => {
  const host = {
    'x0': 1792,
    'y0': 1424,
    'x1': 1984,
    'y1': 1584
  }
  const inside1 = {
    'x0': 1816,
    'y0': 1536,
    'x1': 1960,
    'y1': 1664
  }
  const inside2 = {
    'x0': 1712,
    'y0': 1536,
    'x1': 1856,
    'y1': 1664
  }
  const inside3 = {
    'x0': 1696,
    'y0': 1344,
    'x1': 1840,
    'y1': 1472
  }
  const outside = {
    'x0': 2128,
    'y0': 1472,
    'x1': 2272,
    'y1': 1600
  }
  expect(isInside(host, inside1)).toEqual(true)
  expect(isInside(host, inside2)).toEqual(true)
  expect(isInside(host, inside3)).toEqual(true)
  expect(isInside(host, outside)).toEqual(false)
})
