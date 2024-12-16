import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  outDir: "../dist/docs",
  server: {
    host: true
  },
  integrations: [
    starlight({
      title: 'estridi',
      social: {
      },
      customCss: [
        "./src/styles/style.css"
      ],
       components: {
       }
    })
  ]
})
