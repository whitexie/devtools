import type { Event } from '@rolldown/debug'
import { join } from 'pathe'
import { RolldownEventsReader } from '../../rolldown/events-reader'
import { defineRpcFunction } from '../utils'

export type RolldownEvent = Event['fields']['action'] & {
  timestamp: string
}

export const rolldownGetModuleList = defineRpcFunction({
  name: 'vite:rolldown:get-module-list',
  type: 'query',
  setup: async ({ cwd }) => {
    return {
      handler: async ({ buildId }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', buildId, 'log.json'))
        await reader.read()
        const modules = new Set<string>()
        for (const event of reader.manager.events) {
          modules.add(event.module_id)
        }
        return Array.from(modules)
      },
    }
  },
})
