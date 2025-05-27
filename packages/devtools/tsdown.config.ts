import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
    'src/dirs.ts',
  ],
  clean: false,
  target: 'esnext',
})
