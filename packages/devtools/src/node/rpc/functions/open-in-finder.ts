import { defineRpcFunction } from '../types'

export const openInFinder = defineRpcFunction({
  name: 'vite:open-in-finder',
  type: 'action',
  setup: () => ({
    handler: async (path: string) => {
      await import('open').then(r => r.default(path))
    },
  }),
})
