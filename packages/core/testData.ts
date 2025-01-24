import * as fs from 'node:fs'
import { loadFigmaDocument } from './src/sources/figma.js'

const token = JSON.parse(fs.readFileSync('estridi.json', 'utf8')).token

const getData = async () => {
  const figmaData = await loadFigmaDocument({ token, fileId: 'Izz9320atTsGRKo1AjiuxZ' })
  fs.writeFileSync('./src/sources/test/figma.json', JSON.stringify(figmaData, null, 2), 'utf8')
}

getData().then()
