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

        // TODO: read from meta.json
        const plugins = new Set(
          reader.manager.events.map(e => 'plugin_name' in e ? e.plugin_name : null)
            .filter(x => !!x),
        )

        return {
          id: session,
          rootDir: cwd,
          plugins: Array.from(plugins),
          modules: Array.from(reader.manager.modules.values())
            .sort((a, b) => a.id.localeCompare(b.id)),
        }
      },
    }
  },
})
