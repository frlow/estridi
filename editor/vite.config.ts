import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { startServer } from './src/server'

const serverPlugin = (): Plugin => ({
  name: 'server-plugin',
  apply: 'serve',
  buildStart: () => {
    startServer()
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serverPlugin()]
})
