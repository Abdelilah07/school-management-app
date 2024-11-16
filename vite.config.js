import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ command }) => {

  const config = {
    plugins: [react(), svgr()],
    build: {
      outDir: 'docs',
    },
  }

  // Sets the base URL only during the build process
  if (command === 'build') {
    config.base = '/school-management-app'
  }

  return config
})