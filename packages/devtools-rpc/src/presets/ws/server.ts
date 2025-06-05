import type { BirpcGroup, ChannelOptions } from 'birpc'
import { WebSocketServer } from 'ws'

export interface WebSocketRpcServerOptions {
  port: number
}

export function createWsRpcPreset(options: WebSocketRpcServerOptions) {
  const {
    port,
  } = options
  const wss = new WebSocketServer({
    port,
  })

  return <ClientFunctions, ServerFunctions>(rpc: BirpcGroup<ClientFunctions, ServerFunctions>) => {
    wss.on('connection', (ws) => {
      const channel: ChannelOptions = {
        post: (data) => {
          ws.send(data)
        },
        on: (fn) => {
          ws.on('message', (data) => {
            fn(data.toString())
          })
        },
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      }

      rpc.updateChannels((channels) => {
        channels.push(channel)
      })

      ws.on('close', () => {
        rpc.updateChannels((channels) => {
          const index = channels.indexOf(channel)
          if (index >= 0)
            channels.splice(index, 1)
        })
      })
    })
  }
}
