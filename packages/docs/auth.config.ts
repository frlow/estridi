// auth.config.ts
import GitHub from '@auth/core/providers/github'
import { defineConfig } from 'auth-astro'
import type { Profile } from '@auth/core/types'

const approvedUsers = ['lowet84']

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(args) {
      const profile = args.profile as Profile & { login: string }
      return approvedUsers.includes(profile.login)
    },
  },
})
