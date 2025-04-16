import { join } from 'pathe'
import { RolldownEventsReader } from '../../rolldown/events-reader'
import { defineRpcFunction } from '../utils'

export const rolldownGetModuleInfo = defineRpcFunction({
  name: 'vite:rolldown:get-module-info',
  type: 'query',
  setup: ({ cwd }) => {
    return {
      handler: async ({ build, module }: { build: string, module: string }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', build, 'log.json'))
        await reader.read()
        const events = reader.manager.events.filter(event => event.module_id === module)
        return {
          events,
        }
      },
    }
  },
})
