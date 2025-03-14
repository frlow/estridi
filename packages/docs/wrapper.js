import fs from 'node:fs'
fs.mkdirSync("../../dist/", {recursive: true })
fs.writeFileSync('../../dist/docs.js', `#!/usr/bin/env node
import './docs/server/entry.mjs'`, 'utf8')
