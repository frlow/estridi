// auth.config.ts
import GitHub from '@auth/core/providers/github'
import { defineConfig } from 'auth-astro'
import { saveUserId } from './src/pages/files.ts'

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(args) {
      saveUserId(args.user, args.account!)
      return true
    },
    session: async (args) => {
      args.session.user.id = args.token.sub!
      return args.session
    },
  },
})
