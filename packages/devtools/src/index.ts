import type { Plugin } from 'vite'
import './types'

export function ViteDevTools(): Plugin {
  return {
    name: 'vite:devtools',
    enforce: 'post',
    configureServer(_server) {
      // console.log(server)
    },
    sharedDuringBuild: true,
    buildStart() {
      // console.log('buildStart')
    },
  }
}
