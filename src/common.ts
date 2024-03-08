import { NodeMetadata } from './figma/nodes'
import { allKeysInFeature, testsInFeature, validationsInFeature } from './generators/utils/scraped'

export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g

export type Scraped = Record<string, NodeMetadata & {
  connections?: Record<string, string>
  rows?: string[][]
}>

export type Feature = {
  name: string,
  fileName: string
  keys: ReturnType<typeof allKeysInFeature>
  tests: ReturnType<typeof testsInFeature>
  validations: ReturnType<typeof validationsInFeature>
}
