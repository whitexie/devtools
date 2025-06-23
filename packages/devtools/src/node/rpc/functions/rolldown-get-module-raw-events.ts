import { join } from 'pathe'
import { RolldownEventsReader } from '../../rolldown/events-reader'
import { defineRpcFunction } from '../utils'

export const rolldownGetModuleRawEvents = defineRpcFunction({
  name: 'vite:rolldown:get-module-raw-events',
  type: 'query',
  setup: ({ cwd }) => {
    return {
      handler: async ({ session, module }: { session: string, module: string }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', session, 'logs.json'))
        await reader.read()
        const events = reader.manager.events.filter(event => 'module_id' in event && event.module_id !== module)
        return {
          events,
        }
      },
    }
  },
})
