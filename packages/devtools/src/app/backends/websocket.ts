import type { ServerFunctions } from '../../node/rpc'
import type { ClientFunctions } from '../../shared/types'
import type { Backend } from '../types/backend'
import { createBirpc } from 'birpc'
import { parse, stringify } from 'structured-clone-es'
import { ref, shallowRef } from 'vue'

export interface WebSocketBackendOptions {
  name: string
  websocketUrl: string
}

export function createWebSocketBackend(options: WebSocketBackendOptions): Backend {
  const status: Backend['status'] = ref('idle')
  const error: Backend['connectionError'] = shallowRef(undefined)

  let connectPromise: Promise<WebSocket> | undefined
  let onMessage: any = () => {}

  const clientFunctions = {} as ClientFunctions

  const rpc = createBirpc<ServerFunctions, ClientFunctions>(clientFunctions, {
    post: async (d) => {
      if (!connectPromise)
        connectPromise = connect()
      const ws = await connectPromise
      while (ws.readyState === ws.CONNECTING) {
        await new Promise<void>(resolve => setTimeout(resolve, 100))
      }
      if (ws.readyState !== ws.OPEN) {
        error.value ||= new Error('WebSocket not open, message sending dismissed')
        throw error.value
      }
      ws.send(d)
    },
    on: (fn) => {
      onMessage = fn
    },
    serialize: stringify,
    deserialize: parse,
    onError(err, name) {
      error.value = err
      console.error(`[vite-devtools] RPC error on executing "${name}":`)
      console.error(err)
    },
    timeout: 120_000,
  })

  async function connect() {
    try {
      const ws = new WebSocket(options.websocketUrl)

      ws.addEventListener('close', () => {
        status.value = 'idle'
      })
      ws.addEventListener('open', () => {
        status.value = 'connected'
        error.value = undefined
      })
      ws.addEventListener('error', (e) => {
        status.value = 'error'
        error.value = e
      })
      ws.addEventListener('message', (e) => {
        status.value = 'connected'
        error.value = undefined
        onMessage(e.data)
      })

      return ws
    }
    catch (e) {
      status.value = 'error'
      error.value = e
      throw e
    }
  }

  return {
    name: options.name,
    status,
    connectionError: error,
    async connect() {
      if (!connectPromise)
        connectPromise = connect()
      await connectPromise
    },
    isDynamic: true,
    functions: {
      'vite:get-payload': async () => {
        try {
          return await rpc['vite:get-payload']()
        }
        catch (err) {
          error.value = err
          throw err
        }
      },
      'vite:open-in-editor': async (filename: string) => rpc['vite:open-in-editor'].asEvent(filename),
      'vite:open-in-finder': async (filename: string) => rpc['vite:open-in-finder'].asEvent(filename),
    },
  }
}
