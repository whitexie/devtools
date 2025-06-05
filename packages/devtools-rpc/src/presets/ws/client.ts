export interface WebSocketRpcClientOptions {
  url: string
}

export function createWsRpcPreset(options: WebSocketRpcClientOptions) {
  const ws = new WebSocket(options.url)
  return {
    on: (handler: (data: string) => void) => {
      ws.addEventListener('message', (e) => {
        handler(e.data)
      })
    },
    post: (data: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
      else {
        function handler() {
          ws.send(data)
          ws.removeEventListener('open', handler)
        }
        ws.addEventListener('open', handler)
      }
    },
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  }
}
