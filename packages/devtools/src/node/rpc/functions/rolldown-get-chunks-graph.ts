import { defineRpcFunction } from '../utils'

export const rolldownGetChunksGraph = defineRpcFunction({
  name: 'vite:rolldown:get-chunks-graph',
  type: 'query',
  setup: ({ manager }) => {
    return {
      handler: async ({ session }: { session: string }) => {
        const reader = await manager.loadSession(session)
        const graph = reader.manager.events.find(x => x.action === 'ChunkGraphReady')
        return graph?.chunks
      },
    }
  },
})
