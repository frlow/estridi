import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  server: {
    host: true
  },
  integrations: [
    starlight({
      title: 'estridi',
      social: {
        // github: 'https://github.com/withastro/starlight',
      },
      // sidebar: [
      //   {
      //     label: 'Introduction',
      //     autogenerate: { directory: 'introduction' }
      //   },
      // ],
      customCss: [
        "./src/styles/style.css"
      ],
       components: {
        Head: "./src/components/Head.astro"
       }
    })
  ]
})
