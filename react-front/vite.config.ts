import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'build'
  },
test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',

    server: {
      deps: {
        inline: ['jsdom']
      }
    },

    pool: 'forks',
    poolOptions: {
      forks: {
        isolate: false
      }
    },
    exclude: ['**/node_modules/**', '**/dist/**'],
    reporters: ['verbose', 'junit', 'html'],
    outputFile: {
      junit: './reports/junit.xml',
      html: './reports/html/index.html'
    }
  }
})