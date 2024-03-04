import { Feature } from '../figma/feature'
import { GenerationResult, getFileName, getPrettyLabel } from './index'
import * as path from 'node:path'

type PropNames = Record<string, string>
const tableValueCutoff = 50
const createScenarioDefinitions = (feature: Feature, propNames: PropNames) => {
  const propNamesTemp: PropNames = {}
  let text = ''
  const givenValues: Record<string, Record<string, boolean>> = {}
  for (const scenario of feature.scenarios) {
    for (const given of scenario.given) {
      const key = `Given ${given.text}`
      propNamesTemp[key] = '(state, value)'
      givenValues[key] = { ...givenValues[key], [given.value || 'N/A']: true }
    }
    for (const then of scenario.then) propNamesTemp[`${getPrettyLabel(then.type)}: ${then.text}`] = 'state'
  }
  Object.keys(propNamesTemp).forEach((key) => {
    text += `\n  '${key}': (state: T${givenValues[key] ? `, value: ${Object.keys(givenValues[key]).sort().map(k => `'${k}'`).join('|')}` : ''}) => Promise<void>`
  })
  Object.keys(propNamesTemp).forEach(key => propNames[key] = propNamesTemp[key])
  return text
}

const createTableDefinitions = (feature: Feature, propNames: PropNames) => {
  const propNamesTemp: PropNames = {}
  let text = ''
  for (const table of feature.tables)
    for (const row of table.rows)
      propNamesTemp[`Validate ${row.label}: ${row.values.map(v => v.substring(0, tableValueCutoff)).join(', ')}`] = 'state'
  Object.keys(propNamesTemp).forEach((key) =>
    text += `\n  '${key}': (state: {page: Page, context: BrowserContext}) => Promise<void>`
  )
  Object.keys(propNamesTemp).forEach(key => propNames[key] = propNamesTemp[key])
  return text
}

const createScenarioTests = (feature: Feature) => {
  let text = ''
  for (const scenario of feature.scenarios) {
    const label = [
      ...scenario.then.map((t) => t.text),
      ' - ',
      ...scenario.given.map((g) => g.value)
    ].join(' ')
    text += '\n  test(\'' + label + '\', async ({page, context}) => {'
    text +=
      '\n    let state: any = steps.Before ? await steps.Before({page, context}) : {page, context}'
    for (const given of scenario.given)
      text +=
        '\n    await steps[\'Given ' +
        given.text +
        `\'](state,'${given.value}')`
    text +=
      '\n    if (steps.BaseGiven) await steps.BaseGiven(state)'
    for (const then of scenario.then)
      text +=
        '\n    await steps[\'' + getPrettyLabel(then.type) + ': ' + then.text + '\'](state)'
    text += '\n  })'
  }
  return text
}

const createTableTests = (feature: Feature) => {
  let text = ''
  for (const table of feature.tables)
    for (const row of table.rows)
      text += `\n  test("Validate ${row.label}", async ({page, context})=>await steps["Validate ${
        row.label}: ${
        row.values.map(v => v.substring(0, tableValueCutoff)).join(', ')}"]({page, context}))`
  return text
}

export const generatePlaywright = (dir: string, features: Feature[]): GenerationResult[] => {
  const ret: GenerationResult[] = []
  for (const feature of features) {
    const propNames: PropNames = {}
    const name = getFileName(feature.name)
    let out = '// WARNING!!'
    out +=
      '\n// this file is auto-generated and will change when updating the system design'
    out += '\n// don\'t change this file!\n'
    out += '\nimport { test, Page, BrowserContext } from \'@playwright/test\''
    out += '\nimport { steps } from \'./' + name + '.steps\''
    out += '\nexport type Steps<T extends {page: Page, context: BrowserContext} = {page: Page, context: BrowserContext}> = {'
    out += '\n  enable: boolean'
    out += '\n  Before?: (args: {page: Page, context: BrowserContext}) => Promise<T>'
    out += '\n  BaseGiven?: (state: T) => Promise<void>'
    out += createScenarioDefinitions(feature, propNames)
    out += createTableDefinitions(feature, propNames)
    out += '\n}'
    out +=
      '\ntest.describe(\'' + feature.name + '\', () => {'
    out+='\n  test.skip(!steps.enable)'
    out += createScenarioTests(feature)
    out += createTableTests(feature)
    out += '\n})'


    ret.push({ file: path.join(dir, `${name}.spec.ts`), content: out, overwrite: true })
    let implementation = `import { Steps } from './${name}.test'`
    implementation += '\nexport const steps: Steps = {'
    implementation += '\n  enable: false,'
    const keys = Object.keys(propNames)
    keys.sort()
    keys.forEach((key) => {
      implementation += `\n  "${key}": async ${propNames[key]} => {debugger ;throw "Not implemented"},`
    })
    implementation += '\n}'
    ret.push({ file: path.join(dir, `${name}.steps.ts`), content: implementation, overwrite: false })
  }
  return ret
}
