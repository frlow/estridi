import starlight from '@astrojs/starlight'
import { defineConfig, passthroughImageService } from 'astro/config'
import nodeWebSocket from 'astro-node-websocket'

import auth from 'auth-astro'

import react from '@astrojs/react'

export default defineConfig({

  devToolbar: { enabled: false },
  image: {
    service: passthroughImageService(),
  },

  server: {
    host: true,
  },

  integrations: [auth(), starlight({
    title: 'estridi',
    social: {},
    customCss: ['./src/styles/style.css'],
    components: {},
  }), react()],

  output: 'server',

  adapter: nodeWebSocket({
    mode: 'standalone',
  }),
})
