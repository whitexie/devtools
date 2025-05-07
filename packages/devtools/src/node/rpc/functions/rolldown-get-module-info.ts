import type { HookResolveIdCallStart } from '@rolldown/debug'
import { diffLines } from 'diff'
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
  importer: string | null
  module_request: string
  import_kind: HookResolveIdCallStart['import_kind']
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
  diff_added: number
  diff_removed: number
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

export interface RolldownModuleLoadNoChanges {
  type: 'load_no_changes'
  id: string
  count: number
  duration: number
}

export type RolldownModuleFlowNode =
  | RolldownResolveInfo
  | RolldownModuleLoadInfo
  | RolldownModuleLoadNoChanges
  | RolldownModuleTransformInfo
  | RolldownModuleTransformNoChanges

const DURATION_THRESHOLD = 10

export const rolldownGetModuleInfo = defineRpcFunction({
  name: 'vite:rolldown:get-module-info',
  type: 'query',
  setup: ({ cwd }) => {
    return {
      handler: async ({ session, module }: { session: string, module: string }) => {
        const reader = RolldownEventsReader.get(join(cwd, '.rolldown', session, 'logs.json'))
        await reader.read()
        const events = reader.manager.events

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

        events.forEach((start, index) => {
          if (start.action !== 'HookLoadCallStart' || start.module_id !== module)
            return

          const end = events.find(e => e.action === 'HookLoadCallEnd' && e.call_id === start.call_id, index)
          if (!end || end.action !== 'HookLoadCallEnd') {
            console.error(`[rolldown] Load call end not found for ${start.call_id}`)
            return
          }
          const duration = +end.timestamp - +start.timestamp
          if (!end.source && duration < DURATION_THRESHOLD)
            return

          info.loads.push({
            type: 'load',
            id: start.event_id,
            plugin_name: start.plugin_name,
            plugin_index: start.plugin_index,
            source: end.source,
            timestamp_start: +start.timestamp,
            timestamp_end: +end.timestamp,
            duration,
          })
        })

        events.forEach((start, index) => {
          if (start.action !== 'HookTransformCallStart' || start.module_id !== module)
            return

          const end = events.find(e => e.action === 'HookTransformCallEnd' && e.call_id === start.call_id, index)
          if (!end || end.action !== 'HookTransformCallEnd') {
            console.error(`[rolldown] Transform call end not found for ${start.event_id}`)
            return
          }
          const duration = +end.timestamp - +start.timestamp
          if (end.transformed_source === start.source && duration < DURATION_THRESHOLD)
            return

          let diff_added = 0
          let diff_removed = 0
          if (start.source !== end.transformed_source && start.source != null && end.transformed_source != null) {
            const delta = diffLines(end.transformed_source, start.source)
            diff_added = delta.filter(d => d.added).map(d => d.value).join('').split(/\n/g).length
            diff_removed = delta.filter(d => d.removed).map(d => d.value).join('').split(/\n/g).length
          }

          info.transforms.push({
            type: 'transform',
            id: start.event_id,
            plugin_name: start.plugin_name,
            plugin_index: start.plugin_index,
            source_from: start.source,
            source_to: end.transformed_source,
            diff_added,
            diff_removed,
            timestamp_start: +start.timestamp,
            timestamp_end: +end.timestamp,
            duration,
          })
        })

        events.forEach((end) => {
          if (end.action !== 'HookResolveIdCallEnd' || end.resolved_id !== module)
            return
          const start = events.find(e => e.action === 'HookResolveIdCallStart' && e.call_id === end.call_id)
          if (!start || start.action !== 'HookResolveIdCallStart') {
            console.error(`[rolldown] resolveId call start not found for ${end.event_id}`)
            return
          }

          const duration = +end.timestamp - +start.timestamp
          const data: RolldownResolveInfo = {
            type: 'resolve',
            id: end.event_id,
            importer: start.importer,
            module_request: start.module_request,
            import_kind: start.import_kind,
            plugin_name: end.plugin_name,
            plugin_index: end.plugin_index,
            resolved_id: end.resolved_id,
            timestamp_start: +start.timestamp,
            timestamp_end: +end.timestamp,
            duration,
          }

          // In Rolldown, resolveId might be called multiple times with different thread of Rust
          // If that happens, we only keep the last on
          const existingIndex = info.resolve_ids.findIndex(r => r.importer === start.importer && r.module_request === start.module_request && r.import_kind === start.import_kind && r.plugin_index === end.plugin_index)
          if (existingIndex >= 0)
            info.resolve_ids.splice(existingIndex, 1)
          info.resolve_ids.push(data)
        })

        info.loads.sort((a, b) => a.plugin_index - b.plugin_index)
        info.transforms.sort((a, b) => a.plugin_index - b.plugin_index)
        info.resolve_ids.sort((a, b) => a.plugin_index - b.plugin_index)

        return info
      },
    }
  },
})
