import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'estridi',
      social: {
        // github: 'https://github.com/withastro/starlight',
      },
      sidebar: [
        {
          label: 'Introduction',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Getting started', slug: 'guides/getting_started' }
          ]
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' }
        }
      ]
    })
  ]
})
