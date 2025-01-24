import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  build: {
    server: `../dist/docs/server`,
    client: `../dist/docs/client`
  },

  server: {
    host: true
  },

  integrations: [
    starlight({
      title: 'estridi',
      social: {},
      customCss: [
        './src/styles/style.css'
      ],
      components: {}
    })
  ],

  output: 'server',

  adapter: node({
    mode: 'standalone'
  })
})
