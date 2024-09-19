import * as fs from 'fs'
import path from 'node:path'

fs.writeFileSync(path.join('dist', 'cjs', 'package.json'), '{"type": "commonjs"}', 'utf8')
