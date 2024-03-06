import { GenerationResult, getFileName, getPrettyLabel } from './index'
import { Scraped } from '../common'
import * as path from 'node:path'
import { allKeysInFeature, testsInFeature, validationsInFeature } from './utils/scraped'

export const generatePlaywright = (dir: string, scraped: Scraped): GenerationResult[] => {
  const features = Object.keys(Object.values(scraped)
    .filter(s => s.type === 'start' || s.type === 'table')
    .reduce((acc, cur) => ({
      ...acc,
      [cur.text]: null
    }), {} as Record<string, null>))

  const ret = features.map(feature => {
    const keyState = (key: any) => {
      if (key.type === 'gateway') return `state: T, value: ${key.values!.map((v: any) => `'${v}'`).join('|')}`
      else if (key.type === 'table') return 'state: {page: Page, context: BrowserContext}'
      else return 'state: T'
    }
    const stepDefinitions = allKeysInFeature(scraped, feature)
      .map(key => `  '${key.key}': (${keyState(key)}) => Promise<void>`)

    const tests = testsInFeature(scraped, feature).map(test => `  test('${test.label}', async ({page, context}) => {
    let state: any = steps.Before ? await steps.Before({page, context}, ${test.keys.map((k: string) => `'${k}'`).join(', ')}) : {page, context}
${test.gateways.map((g: any) => `    await steps['Given ${g.text}'](state,'${g.value}')`).join('\n')}
    if (steps.BaseGiven) await steps.BaseGiven(state)
${test.nodes.map((n: any) => `    await steps['${getPrettyLabel(n.type)}: ${n.text}'](state)`).join('\n')}
  })`)
    const validations = validationsInFeature(scraped, feature).map(v => `  test("${v.label}", async ({page, context})=>await steps["${v.step}"]({page, context}))`)
    const fileContent = `
// WARNING!!
// this file is auto-generated and will change when updating the system design
// don't change this file!

import { test, Page, BrowserContext } from '@playwright/test'
import { steps } from './${getFileName(feature)}.steps'
export type Steps<T extends {page: Page, context: BrowserContext} = {page: Page, context: BrowserContext}> = {
  enable: boolean
  Before?: (args: {page: Page, context: BrowserContext}, ...keys: string[]) => Promise<T>
  BaseGiven?: (state: T) => Promise<void>
${stepDefinitions.join('\n')}
}
test.describe('${feature}', () => {
  test.skip(!steps.enable)
${tests.join('\n')}
${validations.join('\n')}
})`
    return { file: path.join(dir, `${getFileName(feature)}.spec.ts`), content: fileContent.trim(), overwrite: true }
  })

  features.forEach(feature => {
    const keys = allKeysInFeature(scraped, feature)
    const keyState = (key: any) => {
      if (key.type === 'gateway') return `(state, value)`
      else if (key.type === 'table') return 'state'
      else return 'state'
    }
    const implementation = `import { Steps } from './${getFileName(feature)}.spec'
export const steps: Steps = {
  enable: false,
${keys.map(key => `  "${key.key}": async ${keyState(key)} => {debugger ;throw "Not implemented"},`).join('\n')}
}`
    ret.push({
      file: path.join(dir, `${getFileName(feature)}.steps.ts`),
      content: implementation.trim(),
      overwrite: false
    })
  })

  return ret
}
