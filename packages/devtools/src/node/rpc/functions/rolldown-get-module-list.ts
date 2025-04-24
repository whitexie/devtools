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
        const modules = new Set<string>()
        for (const event of reader.manager.events) {
          if ('module_id' in event) {
            modules.add(event.module_id)
          }
        }
        return Array.from(modules)
          .map((id) => {
            return {
              id,
            }
          })
          .sort((a, b) => a.id.localeCompare(b.id))
      },
    }
  },
})
