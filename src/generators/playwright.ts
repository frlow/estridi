import { GenerationResult, getPrettyLabel } from './index'
import { Feature } from '../common'
import * as path from 'node:path'

export const generatePlaywright = (dir: string, features: Feature[]): GenerationResult[] => {
  const ret = features.map(feature => {
    const keyState = (key: any) => {
      if (key.type === 'gateway') return `state: T, value: ${key.values!.map((v: any) => `'${v}'`).join('|')}`
      else if (key.type === 'table') return 'state: {page: Page, context: BrowserContext}'
      else return 'state: T'
    }
    const stepDefinitions = feature.keys
      .map(key => `  '${key.key}': (${keyState(key)}) => Promise<void>`)

    const tests = feature.tests.map(test => `  test(\`${test.label}\`, async ({page, context}) => {
    let state: any = steps.Before ? await steps.Before({page, context}, ${test.keys.map((k: string) => `'${k}'`).join(', ')}) : {page, context}
${test.gateways.map((g: any) => `    await steps['Given ${g.text}'](state,'${g.value}')`).join('\n')}
    if (steps.BaseGiven) await steps.BaseGiven(state)
${test.nodes.map((n: any) => `    await steps['${getPrettyLabel(n.type)}: ${n.text}'](state)`).join('\n')}
  })`)
    const validations = feature.validations.map(v => `  test("${v.label}", async ({page, context})=>await steps["${v.step}"]({page, context}))`)
    const fileContent = `
// WARNING!!
// this file is auto-generated and will change when updating the system design
// don't change this file!

import { test, Page, BrowserContext } from '@playwright/test'
import { steps } from './${feature.fileName}.steps'
export type Steps<T extends {page: Page, context: BrowserContext} = {page: Page, context: BrowserContext}> = {
  enable: boolean
  Before?: (args: {page: Page, context: BrowserContext}, ...keys: string[]) => Promise<T>
  BaseGiven?: (state: T) => Promise<void>
${stepDefinitions.join('\n')}
}
test.describe('${feature.name}', () => {
  if(!steps.enable) return
${tests.join('\n')}
${validations.join('\n')}
})`
    return { file: path.join(dir, `${feature.fileName}.spec.ts`), content: fileContent.trim(), overwrite: true }
  })

  features.forEach(feature => {
    const keys = feature.keys
    const keyState = (key: any) => {
      if (key.type === 'gateway') return `(state, value)`
      else if (key.type === 'table') return 'state'
      else return 'state'
    }
    const implementation = `import { Steps } from './${feature.fileName}.spec'
export const steps: Steps = {
  enable: false,
${keys.map(key => `  "${key.key}": async ${keyState(key)} => {debugger ;throw "Not implemented"},`).join('\n')}
}`
    ret.push({
      file: path.join(dir, `${feature.fileName}.steps.ts`),
      content: implementation.trim(),
      overwrite: false
    })
  })

  return ret
}
