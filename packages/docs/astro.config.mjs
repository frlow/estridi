import starlight from '@astrojs/starlight'
import { defineConfig, passthroughImageService } from 'astro/config'

import node from '@astrojs/node'

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
