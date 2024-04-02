import { expect, test } from 'vitest'
import { isInside } from '../figma/nodes.js'

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
