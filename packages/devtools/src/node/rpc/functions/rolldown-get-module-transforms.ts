import type { RolldownModuleTransformInfo } from '../../../shared/types'
import { diffLines } from 'diff'
import { defineRpcFunction } from '../utils'

const DURATION_THRESHOLD = 10

export const rolldownGetModuleTransforms = defineRpcFunction({
  name: 'vite:rolldown:get-module-transforms',
  type: 'query',
  setup: ({ manager }) => {
    return {
      handler: async ({ session, module }: { session: string, module: string }) => {
        const reader = await manager.loadSession(session)
        const events = reader.manager.events
        const transforms: RolldownModuleTransformInfo[] = []

        if (!events.length)
          return transforms

        events.forEach((start, index) => {
          if (start.action !== 'HookTransformCallStart' || start.module_id !== module)
            return

          const end = events.find(e => e.action === 'HookTransformCallEnd' && e.call_id === start.call_id, index)
          if (!end || end.action !== 'HookTransformCallEnd') {
            console.error(`[rolldown] Transform call end not found for ${start.event_id}`)
            return
          }
          const duration = +end.timestamp - +start.timestamp
          if (end.content === start.content && duration < DURATION_THRESHOLD)
            return

          let diff_added = 0
          let diff_removed = 0
          if (start.content !== end.content && start.content != null && end.content != null) {
            const delta = diffLines(start.content, end.content)
            diff_added = delta.filter(d => d.added).map(d => d.value).join('').split(/\n/g).length
            diff_removed = delta.filter(d => d.removed).map(d => d.value).join('').split(/\n/g).length
          }

          transforms.push({
            type: 'transform',
            id: start.event_id,
            plugin_name: start.plugin_name,
            plugin_id: start.plugin_id,
            content_from: start.content,
            content_to: end.content,
            diff_added,
            diff_removed,
            timestamp_start: +start.timestamp,
            timestamp_end: +end.timestamp,
            duration,
          })
        })

        return transforms.sort((a, b) => a.plugin_id - b.plugin_id)
      },
    }
  },
})
