import { defineRpcFunction } from '../types'

export const getPayload = defineRpcFunction({
  name: 'vite:get-payload',
  type: 'static',
  setup: () => {
    return {
      handler: async () => ({
        timestamp: Date.now(),
      }),
    }
  },
})
