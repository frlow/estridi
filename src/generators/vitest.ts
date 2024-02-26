import { Feature } from '../feature'
import { getFileName } from './index'
import * as fs from 'node:fs'
import { writeFile } from './files'
import * as path from 'node:path'

export const generateVitest = (dir: string, features: Feature[]) => {
  fs.mkdirSync(dir, { recursive: true })
  for (const feature of features) {
    const name = getFileName(feature.name)
    let out = '// WARNING!!'
    out +=
      '\n// this file is auto-generated and will change when updating the system design'
    out += "\n// don't change this file!\n"
    out += "\nimport { describe, test } from 'vitest'"
    out += "\nimport { steps } from './" + name + ".steps'"
    out += '\nexport type Steps<T = any> = {'
    out += '\n  Before?: () => Promise<T|undefined>'
    out += '\n  BaseGiven?: (state: T) => Promise<T|undefined>'
    const propNames: Record<string, null> = {}
    for (const scenario of feature.scenarios) {
      for (const given of scenario.given)
        propNames[`Given ${given.text}: ${given.value}`] = null
      for (const when of scenario.when) propNames[`When ${when.text}`] = null
      for (const then of scenario.then) propNames[`Then ${then.text}`] = null
    }
    Object.keys(propNames).forEach((key) => {
      out += `\n  '${key}': (state: T) => Promise<T|undefined>`
    })
    out += '\n}'
    out +=
      '\ndescribe' +
      (feature.enabled ? '' : '.skip') +
      "('" +
      feature.name +
      "', () => {"
    for (const scenario of feature.scenarios) {
      const label = [
        ...scenario.when.map((w) => w.text),
        ...scenario.then.map((t) => t.text),
        ' - ',
        ...scenario.given.map((g) => g.value),
      ].join(' ')
      out += "\n  test('" + label + "', async () => {"
      out +=
        '\n    let state: any = steps.Before ? await steps.Before() : undefined'
      for (const given of scenario.given)
        out +=
          "\n    state = await steps['Given " +
          given.text +
          ': ' +
          given.value +
          "'](state) || state"
      out +=
        '\n    if (steps.BaseGiven) state = await steps.BaseGiven(state)|| state'
      for (const when of scenario.when)
        out +=
          "\n    state = await steps['When " + when.text + "'](state)|| state"
      for (const then of scenario.then)
        out +=
          "\n    state = await steps['Then " + then.text + "'](state)|| state"
      out += '\n  })'
    }
    out += '\n})'

    writeFile(path.join(dir, `${name}.test.ts`), out)
    if (!fs.existsSync(path.join(dir, `${name}.steps.ts`))) {
      let implementation = `import { Steps } from './${name}.test'`
      implementation += '\nexport const steps: Steps = {'
      Object.keys(propNames).forEach((key) => {
        implementation += `\n  "${key}": async state => {debugger ;throw "Not implemented"},`
      })
      implementation += '\n}'

      writeFile(path.join(dir, `${name}.steps.ts`), implementation)
    }
  }
}
