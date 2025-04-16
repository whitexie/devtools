import { join } from 'pathe'
import { RolldownEventsReader } from '../../rolldown/events-reader'
import { defineRpcFunction } from '../utils'

export const rolldownGetModuleList = defineRpcFunction({
  name: 'vite:rolldown:get-module-list',
  type: 'query',
  setup: async ({ cwd }) => {
    return {
      handler: async ({ build }: { build: string }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', build, 'log.json'))
        await reader.read()
        const modules = new Set<string>()
        for (const event of reader.manager.events) {
          modules.add(event.module_id)
        }
        return Array.from(modules)
          .map((id) => {
            return {
              id,
            }
          })
      },
    }
  },
})
