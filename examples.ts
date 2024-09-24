import fs from 'fs'
import { estridi } from './src/index.js'
import path from 'path'
import { figmaExampleTE } from './tests/serviceCalls/data/figmaExamples.js'

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

  // instance.writeFile = (content, fileName)=>{
  //   fs.mkdirSync("demo/tests", {recursive: true})
  //   fs.writeFileSync(`demo/${fileName}`, content, 'utf8')
  // }
  // instance.loadConfig = () => ({
  //   type: 'figma',
  //   token: '-',
  //   fileId: '-',
  //   variant: 'TE',
  //   logging: 'verbose',
  // })
  // instance.loadFigmaDocument = async () => figmaExampleTE as any
  // await instance.generate()
}
load().then()
