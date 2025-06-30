import type { SessionMeta } from '@rolldown/debug'
import fs from 'node:fs/promises'
import { join } from 'pathe'
import { RolldownEventsReader } from './events-reader'

export interface BuildInfo {
  id: string
  createdAt: number
  meta: SessionMeta
}

export class RolldownLogsManager {
  constructor(
    readonly dir: string,
  ) {
  }

  async list() {
    const sessions = await fs.readdir(this.dir, {
      withFileTypes: true,
    })
    return await Promise.all(sessions
      .filter(d => d.isDirectory())
      .map(async (d): Promise<BuildInfo> => {
        const stats = await fs.stat(join(this.dir, d.name))
        return {
          id: d.name,
          createdAt: stats.birthtime.getTime(),
          meta: JSON.parse(await fs.readFile(join(this.dir, d.name, 'meta.json'), 'utf-8')) as SessionMeta,
        }
      }),
    )
  }

  async loadSession(session: string) {
    const reader = RolldownEventsReader.get(join(this.dir, session, 'logs.json'))
    reader.meta ||= JSON.parse(await fs.readFile(join(this.dir, session, 'meta.json'), 'utf-8')) as SessionMeta
    await reader.read()
    return reader
  }
}
