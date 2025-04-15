import { defineRpcFunction } from '../types'

export const getPayload = defineRpcFunction({
  name: 'vite:get-payload',
  type: 'static',
  setup: () => ({
    handler: async () => ({
      timestamp: Date.now(),
    }),
  }),
})
