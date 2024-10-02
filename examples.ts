import fs from 'fs'
import { estridi } from './src/index.js'
import path from 'path'

const load = async () => {
  const config = JSON.parse(fs.readFileSync('estridi.json', 'utf8'))
  const instance = estridi({ target: 'vitest', rootName: 'main' })
  const data = await instance.loadFigmaDocument({
    fileId: 'hERI5lpQhUIlONvwsE03d1',
    token: config.token,
  })
  fs.writeFileSync(
    path.join('tests', 'serviceCalls', 'data', 'figmaExamples.ts'),
    `export const figmaExampleTE = ${JSON.stringify(data, null, 2)}`,
    'utf8',
  )
}
load().then()
