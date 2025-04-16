import { join } from 'pathe'
import { RolldownEventsReader } from '../../rolldown/events-reader'
import { defineRpcFunction } from '../utils'

export const rolldownGetRawEvents = defineRpcFunction({
  name: 'vite:rolldown:get-raw-events',
  type: 'query',
  setup: ({ cwd }) => {
    return {
      handler: async ({ build }: { build: string }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', build, 'log.json'))
        await reader.read()
        return reader.manager.events
      },
    }
  },
})
