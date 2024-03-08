import { GenerationResult, getPrettyLabel } from './index'
import { Feature } from '../common'
import * as path from 'node:path'

export const generateVitest = (dir: string, features: Feature[]): GenerationResult[] => {


  const ret = features.map(feature => {
    const keyState = (key: any) => {
      if (key.type === 'gateway') return `state: T, value: ${key.values!.map((v: any) => `'${v}'`).join('|')}`
      else if (key.type === 'table') return ''
      else return 'state: T'
    }
    const stepDefinitions = feature.keys
      .map(key => `  '${key.key}': (${keyState(key)}) => Promise<void>`)

    const tests = feature.tests.map(test => `  test('${test.label}', async () => {
    let state: any = steps.Before ? await steps.Before(${test.keys.map((k: string) => `'${k}'`).join(', ')}) : undefined
${test.gateways.map((g: any) => `    await steps['Given ${g.text}'](state,'${g.value}')`).join('\n')}
    if (steps.BaseGiven) await steps.BaseGiven(state)
${test.nodes.map((n: any) => `    await steps['${getPrettyLabel(n.type)}: ${n.text}'](state)`).join('\n')}
  })`)
    const validations = feature.validations.map(v => `  test("${v.label}", async ()=>await steps["${v.step}"]())`)

    const fileContent = `
// WARNING!!
// this file is auto-generated and will change when updating the system design
// don't change this file!

import { describe, test } from 'vitest'
import { steps } from './${feature.fileName}.steps'
export type Steps<T = any> = {
  enable: boolean
  Before?: (...keys: string[]) => Promise<T>
  BaseGiven?: (state: T) => Promise<void>
${stepDefinitions.join('\n')}
}
describe.skipIf(!steps.enable)('${feature.name}', () => {
${tests.join('\n')}
${validations.join('\n')}
})`
    return { file: path.join(dir, `${feature.fileName}.test.ts`), content: fileContent.trim(), overwrite: true }
  })

  features.forEach(feature => {
    const keys = feature.keys
    const keyState = (key: any) => {
      if (key.type === 'gateway') return `(state, value)`
      else if (key.type === 'table') return '()'
      else return 'state'
    }
    const implementation = `import { Steps } from './${feature.fileName}.test'
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
