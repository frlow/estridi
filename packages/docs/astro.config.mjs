import starlight from '@astrojs/starlight'
import { defineConfig, passthroughImageService } from 'astro/config'

import node from '@astrojs/node'

// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import fs from 'node:fs'
import path from 'node:path';
import url from 'node:url';

const integration = starlight({
  title: 'estridi',
  social: {},
  customCss: [
    './src/styles/style.css'
  ],
  components: {}
})

integration.hooks["astro:build:ssr"] = options => {
  const entryFilePath = path.join(url.fileURLToPath(options.manifest.buildServerDir), "entry.mjs")
  fs.writeFileSync(entryFilePath, `import path from 'path'
import url from 'url'
${fs.readFileSync(entryFilePath, 'utf8')
    .replace(/"client": ".*?",/gs, `"client": url.pathToFileURL(path.join(import.meta.dirname, "../client")).href,`)
    .replace(/"server": ".*?",/gs, `"server": url.pathToFileURL(import.meta.dirname).href,`)
  }`, 'utf8')
}

// https://astro.build/config
export default defineConfig({
  build: {
    server: `../../../dist/docs/server`,
    client: `../../../dist/docs/client`
  },

  image: {
    service: passthroughImageService()
  },

  server: {
    host: true
  },

  integrations: [
    integration
  ],

  output: 'server',

  adapter: node({
    mode: 'standalone'
  })
})
