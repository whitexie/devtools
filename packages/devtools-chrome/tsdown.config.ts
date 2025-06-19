import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/*.ts',
    '!src/app/*.ts',
  ],
  clean: false,
  external: ['./app/devtools-app.js'],
})
