// const features = Object.keys(Object.values(scraped)
//   .filter(s => s.type === 'start' || s.type === 'table')
//   .reduce((acc, cur) => ({
//     ...acc,
//     [cur.text]: null
//   }), {} as Record<string, null>))

import { Feature, Scraped } from '../../common'
import { getFileName } from '../index'
import { allKeysInFeature, testsInFeature, validationsInFeature } from './scraped'

export const getFeatures = (scraped: Scraped): Feature[] => {
  const featureNames = Object.keys(Object.values(scraped)
    .filter(s => s.type === 'start' || s.type === 'table')
    .reduce((acc, cur) => ({
      ...acc,
      [cur.text]: null
    }), {} as Record<string, null>))

  return featureNames.map(f => ({
    name: f,
    fileName: getFileName(f),
    keys: allKeysInFeature(scraped, f),
    tests: testsInFeature(scraped, f),
    validations: validationsInFeature(scraped, f)
  }))
}
