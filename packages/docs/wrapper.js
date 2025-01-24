import fs from 'node:fs'
fs.writeFileSync('../../dist/docs.js', `#!/usr/bin/env node
import './docs/server/entry.mjs'`, 'utf8')
