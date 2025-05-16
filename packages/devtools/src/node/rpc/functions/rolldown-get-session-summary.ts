import { join } from 'pathe'
import { RolldownEventsReader } from '../../rolldown/events-reader'
import { defineRpcFunction } from '../utils'

export const rolldownGetSessionSummary = defineRpcFunction({
  name: 'vite:rolldown:get-session-summary',
  type: 'query',
  setup: async ({ cwd }) => {
    return {
      handler: async ({ session }: { session: string }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', session, 'logs.json'))
        await reader.read()
        return {
          id: session,
          rootDir: cwd,
          modules: Array.from(reader.manager.modules.values())
            .sort((a, b) => a.id.localeCompare(b.id)),
        }
      },
    }
  },
})
