import { GenerationResult, getFileName, getPrettyLabel } from './index'
import { Scraped } from '../common'
import * as path from 'node:path'
import { allKeysInFeature, testsInFeature } from './utils/scraped'

export const generateVitest = (dir: string, scraped: Scraped): GenerationResult[] => {
  const features = Object.keys(Object.values(scraped)
    .filter(s => s.type === 'start' || s.type === 'table')
    .reduce((acc, cur) => ({
      ...acc,
      [cur.text]: null
    }), {} as Record<string, null>))

  return features.map(feature => {
    const keyState = (key: any) => {
      if (key.type === 'gateway') return `state: T, value: ${key.values!.map((v: any) => `'${v}'`).join('|')}`
      else if (key.type === 'table') return ''
      else return 'state: T'
    }
    const stepDefinitions = allKeysInFeature(scraped, feature)
      .map(key => `  '${key.key}': (${keyState(key)}) => Promise<void>`)

    const tests = testsInFeature(scraped, feature).map(test => `  test('${test.label}', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
${test.gateways.map((g: any) => `    await steps['Given ${g.text}'](state,'${g.value}')`).join('\n')}
    if (steps.BaseGiven) await steps.BaseGiven(state)
${test.nodes.map((n: any) => `    await steps['${getPrettyLabel(n.type)}: ${n.text}'](state)`).join('\n')}
  })`)
    const fileContent = `
// WARNING!!
// this file is auto-generated and will change when updating the system design
// don't change this file!

import { describe, test } from 'vitest'
import { steps } from './${getFileName(feature)}.steps'
export type Steps<T = any> = {
  enable: boolean
  Before?: () => Promise<T>
  BaseGiven?: (state: T) => Promise<void>
${stepDefinitions.join('\n')}
}
describe.skipIf(!steps.enable)('${feature}', () => {
${tests.join('\n')}
}`
    return { file: path.join(dir, `${getFileName(feature)}.test.ts`), content: fileContent.trim(), overwrite: true }
  })
}
