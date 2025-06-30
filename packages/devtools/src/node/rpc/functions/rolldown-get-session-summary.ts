import { defineRpcFunction } from '../utils'

export const rolldownGetSessionSummary = defineRpcFunction({
  name: 'vite:rolldown:get-session-summary',
  type: 'query',
  setup: async ({ manager }) => {
    return {
      handler: async ({ session }: { session: string }) => {
        const reader = await manager.loadSession(session)

        return {
          id: session,
          meta: reader.meta,
          modules: Array.from(reader.manager.modules.values())
            .sort((a, b) => a.id.localeCompare(b.id)),
        }
      },
    }
  },
})
