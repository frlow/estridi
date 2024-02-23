import { Feature } from '../feature'
import { getFileName } from './index'
import * as fs from 'node:fs'

export const generateVitest = (features: Feature[]) => {
  for (const feature of features) {
    const name = getFileName(feature.name)
    let out = "import { describe, test } from 'vitest'"
    out += "\nimport { steps } from './${name}.steps'"
    out += '\nexport type Steps<T = any> = {'
    out += '\n  Before?: () => Promise<T>'
    // TODO steps types here!
    out += '\n}'
    out += "\ndescribe('" + feature.name + "', () => {"
    for (const scenario of feature.scenarios) {
      out +=
        "\n  test('" + feature.scenarios.indexOf(scenario) + "', async () => {"
      out +=
        '\n    let state: any = steps.Before ? await steps.Before() : undefined'
      for (const given of scenario.given) {
        out += "\n    state = await steps['" + given.text + "'](state)"
      }
      for (const when of scenario.when) {
        out += "\n    state = await steps['When " + when.text + "'](state)"
      }
      for (const then of scenario.then) {
        out += "\n    state = await steps['Then " + then.text + "'](state)"
      }
      out += '\n  })'
    }
    out += '\n})'
    fs.mkdirSync(`output/vitest`, { recursive: true })
    fs.writeFileSync(`output/vitest/${name}.test.ts`, out, 'utf8')
  }
}
