import type { ServerFunctions, ViteDevToolsPayload } from '../shared/types'
import type { ViteDevToolsConfig } from './config'
import c from 'ansis'
import { hash as getHash } from 'ohash'
import { loadConfig } from 'unconfig'
import { MARK_CHECK } from './constants'

export interface CreateServerFunctionsOptions {
  cwd: string
  mode: 'dev' | 'build'
  configFile?: string
}

export function createServerFunctions(options: CreateServerFunctionsOptions): ServerFunctions {
  let _config: Promise<ViteDevToolsConfig> | null = null
  let _payload: Promise<ViteDevToolsPayload> | null = null

  async function getConfig(force = false) {
    if (force)
      _config = null
    if (!_config)
      _config = _getConfig()
    return _config
  }

  async function _getConfig() {
    const result = await loadConfig<ViteDevToolsConfig>({
      cwd: options.cwd,
      sources: [
        {
          files: options.configFile || 'vite-devtools.config',
        },
      ],
      defaults: {},
      merge: true,
    })
    if (result.sources.length)
      console.log(c.green`${MARK_CHECK} Config loaded from ${result.sources.join(', ')}`)
    return result.config
  }

  function getPayload(force?: boolean) {
    if (force) {
      _config = null
      _payload = null
    }
    if (!_payload)
      _payload = _getPayload()
    return _payload
  }

  async function _getPayload(): Promise<ViteDevToolsPayload> {
    const config = await getConfig()

    return {
      timestamp: Date.now(),
      hash: getHash(config),
    }
  }

  return {
    getPayload,
    async openInEditor(filename: string) {
      await import('launch-editor').then(r => r.default(filename))
    },
    async openInFinder(filename: string) {
      await import('open').then(r => r.default(filename))
    },
  }
}
