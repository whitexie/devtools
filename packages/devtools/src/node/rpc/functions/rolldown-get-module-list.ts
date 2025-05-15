import { join } from 'pathe'
import { RolldownEventsReader } from '../../rolldown/events-reader'
import { defineRpcFunction } from '../utils'

export const rolldownGetModuleList = defineRpcFunction({
  name: 'vite:rolldown:get-module-list',
  type: 'query',
  setup: async ({ cwd }) => {
    return {
      handler: async ({ session }: { session: string }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', session, 'logs.json'))
        await reader.read()
        return Array.from(reader.manager.modules.values())
          .sort((a, b) => a.id.localeCompare(b.id))
      },
    }
  },
})
