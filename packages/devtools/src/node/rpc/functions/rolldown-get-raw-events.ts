import type { Event } from '@rolldown/debug'
import fs from 'node:fs/promises'
import { join } from 'pathe'
import { parseJsonStreamWithConcatArrays } from '../../utils/json-parse-stream'
import { defineRpcFunction } from '../types'

export const rolldownGetRawEvents = defineRpcFunction({
  name: 'vite:rolldown:get-raw-events',
  type: 'query',
  setup: ({ cwd }) => {
    return {
      handler: async ({ buildId }) => {
        const raw = await fs.open(join(cwd, '.rolldown', buildId, 'log.json'), 'r')
        const stream = raw.createReadStream()
        const events = await parseJsonStreamWithConcatArrays(stream) as Event[]
        return events
      },
    }
  },
})
