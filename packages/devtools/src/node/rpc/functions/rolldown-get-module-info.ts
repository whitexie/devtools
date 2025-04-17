import { join } from 'pathe'
import { RolldownEventsReader } from '../../rolldown/events-reader'
import { defineRpcFunction } from '../utils'

export interface ModuleInfo {
  id: string
  loads: RolldownModuleLoadInfo[]
  transforms: RolldownModuleTransformInfo[]

  // TODO: Awaits https://github.com/rolldown/rolldown/issues/4135
  deps: string[]
  importers: string[]
}

export interface RolldownModuleLoadInfo {
  id: string
  plugin_name: string
  source: string | null
  timestamp_start: number
  timestamp_end: number
  duration: number
}

export interface RolldownModuleTransformInfo {
  id: string
  plugin_name: string
  source_from: string | null
  source_to: string | null
  timestamp_start: number
  timestamp_end: number
  duration: number
}

const DURATION_THRESHOLD = 10

export const rolldownGetModuleInfo = defineRpcFunction({
  name: 'vite:rolldown:get-module-info',
  type: 'query',
  setup: ({ cwd }) => {
    return {
      handler: async ({ build, module }: { build: string, module: string }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', build, 'log.json'))
        await reader.read()
        const events = reader.manager.events.filter(event => event.module_id === module)

        if (!events.length)
          return null

        const info: ModuleInfo = {
          id: module,
          loads: [],
          transforms: [],
          deps: [],
          importers: [],
        }

        for (const event of events) {
          if (event.kind === 'HookLoadCallEnd') {
            // TODO: use ID to pair start and end
            const start = events.find(e => e.kind === 'HookLoadCallStart' && e.module_id === event.module_id && e.plugin_name === event.plugin_name)
            if (!start) {
              console.error(`[rolldown] Load call start not found for ${event.event_id}`)
              continue
            }
            const duration = +event.timestamp - +start.timestamp
            if (!event.source && duration < DURATION_THRESHOLD)
              continue
            info.loads.push({
              id: event.event_id,
              plugin_name: event.plugin_name,
              source: event.source,
              timestamp_start: +start.timestamp,
              timestamp_end: +event.timestamp,
              duration,
            })
          }
        }

        for (const event of events) {
          if (event.kind === 'HookTransformCallEnd') {
            // TODO: use ID to pair start and end
            const start = events.find(e => e.kind === 'HookTransformCallStart' && e.module_id === event.module_id && e.plugin_name === event.plugin_name)
            if (!start || start.kind !== 'HookTransformCallStart') {
              console.error(`[rolldown] Transform call start not found for ${event.event_id}`)
              continue
            }
            const duration = +event.timestamp - +start.timestamp
            if (start.source === event.transformed_source && duration < DURATION_THRESHOLD)
              continue
            info.transforms.push({
              id: event.event_id,
              plugin_name: event.plugin_name,
              source_from: start.source,
              source_to: event.transformed_source,
              timestamp_start: +start.timestamp,
              timestamp_end: +event.timestamp,
              duration,
            })
          }
        }

        info.loads.sort((a, b) => a.timestamp_start - b.timestamp_start)
        info.transforms.sort((a, b) => a.timestamp_start - b.timestamp_start)

        return info
      },
    }
  },
})
