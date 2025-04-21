import fs from 'node:fs/promises'
import { join } from 'pathe'
import { defineRpcFunction } from '../utils'

export interface BuildInfo {
  id: string
  createdAt: number
}

export const rolldownListSessions = defineRpcFunction({
  name: 'vite:rolldown:list-sessions',
  type: 'query',
  setup: ({ cwd }) => {
    return {
      handler: async (): Promise<BuildInfo[]> => {
        const sessions = await fs.readdir(join(cwd, '.rolldown'), {
          withFileTypes: true,
        })
        return await Promise.all(sessions
          .filter(d => d.isDirectory())
          .map(async (d): Promise<BuildInfo> => {
            // TODO: read from meta.json
            const stats = await fs.stat(join(cwd, '.rolldown', d.name))
            return {
              id: d.name,
              createdAt: stats.birthtime.getTime(),
            }
          }),
        )
      },
    }
  },
})
