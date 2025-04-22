import { join } from 'pathe'
import { RolldownEventsReader } from '../../rolldown/events-reader'
import { defineRpcFunction } from '../utils'

export interface ModuleInfo {
  id: string
  loads: RolldownModuleLoadInfo[]
  transforms: RolldownModuleTransformInfo[]
  resolve_ids: RolldownResolveInfo[]

  // TODO: Awaits https://github.com/rolldown/rolldown/issues/4135
  deps: string[]
  importers: string[]
}
export interface RolldownResolveInfo {
  type: 'resolve'
  id: string
  plugin_name: string
  plugin_index: number
  resolved_id: string | null
  timestamp_start: number
  timestamp_end: number
  duration: number
}

export interface RolldownModuleLoadInfo {
  type: 'load'
  id: string
  plugin_name: string
  plugin_index: number
  source: string | null
  timestamp_start: number
  timestamp_end: number
  duration: number
}

export interface RolldownModuleTransformInfo {
  type: 'transform'
  id: string
  plugin_name: string
  plugin_index: number
  source_from: string | null
  source_to: string | null
  timestamp_start: number
  timestamp_end: number
  duration: number
}

export interface RolldownModuleTransformNoChanges {
  type: 'transform_no_changes'
  id: string
  count: number
  duration: number
}

export type RolldownModuleFlowNode =
  | RolldownModuleLoadInfo
  | RolldownModuleTransformInfo
  | RolldownModuleTransformNoChanges
  | RolldownResolveInfo

const DURATION_THRESHOLD = 50

export const rolldownGetModuleInfo = defineRpcFunction({
  name: 'vite:rolldown:get-module-info',
  type: 'query',
  setup: ({ cwd }) => {
    return {
      handler: async ({ session, module }: { session: string, module: string }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', session, 'log.json'))
        await reader.read()
        const events = reader.manager.events.filter(event => 'module_id' in event && event.module_id === module)

        if (!events.length)
          return null

        const info: ModuleInfo = {
          id: module,
          loads: [],
          transforms: [],
          deps: [],
          importers: [],
          resolve_ids: [],
        }

        for (const event of events) {
          if (event.kind === 'HookLoadCallEnd') {
            // TODO: use ID to pair start and end
            const start = events.find(e => e.kind === 'HookLoadCallStart' && e.module_id === event.module_id && e.plugin_index === event.plugin_index)
            if (!start) {
              console.error(`[rolldown] Load call start not found for ${event.event_id}`)
              continue
            }
            const duration = +event.timestamp - +start.timestamp
            if (!event.source && duration < DURATION_THRESHOLD)
              continue
            info.loads.push({
              type: 'load',
              id: event.event_id,
              plugin_name: event.plugin_name,
              plugin_index: event.plugin_index,
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
            const start = events.find(e => e.kind === 'HookTransformCallStart' && e.module_id === event.module_id && e.plugin_index === event.plugin_index)
            if (!start || start.kind !== 'HookTransformCallStart') {
              console.error(`[rolldown] Transform call start not found for ${event.event_id}`)
              continue
            }
            const duration = +event.timestamp - +start.timestamp
            if (start.source === event.transformed_source && duration < DURATION_THRESHOLD)
              continue
            info.transforms.push({
              type: 'transform',
              id: event.event_id,
              plugin_name: event.plugin_name,
              plugin_index: event.plugin_index,
              source_from: start.source,
              source_to: event.transformed_source,
              timestamp_start: +start.timestamp,
              timestamp_end: +event.timestamp,
              duration,
            })
          }
        }

        for (const event of events) {
          if (event.kind === 'HookResolveIdCallEnd') {
            // TODO: use ID to pair start and end
            const start = events.find(e => e.kind === 'HookResolveIdCallStart' && e.plugin_index === event.plugin_index)
            if (!start || start.kind !== 'HookResolveIdCallStart') {
              console.error(`[rolldown] resolveId call start not found for ${event.event_id}`)
              continue
            }
            const duration = +event.timestamp - +start.timestamp
            info.resolve_ids.push({
              type: 'resolve',
              id: event.event_id,
              plugin_name: event.plugin_name,
              plugin_index: event.plugin_index,
              resolved_id: event.resolved_id,
              timestamp_start: +start.timestamp,
              timestamp_end: +event.timestamp,
              duration,
            })
          }
        }

        info.loads.sort((a, b) => a.plugin_index - b.plugin_index)
        info.transforms.sort((a, b) => a.plugin_index - b.plugin_index)
        info.resolve_ids.sort((a, b) => a.plugin_index - b.plugin_index)

        return info
      },
    }
  },
})
