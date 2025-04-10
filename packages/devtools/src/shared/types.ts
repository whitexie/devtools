export interface ViteDevToolsPayload {
  timestamp: number
  hash: string
}

export interface ViteDevToolsHeartbeat {
  status: 'heartbeat'
  heartbeat: number
}

export interface ViteDevToolsError {
  status: 'error'
  error: any
}

export type ViteDevToolsLog =
  ViteDevToolsPayload |
  ViteDevToolsHeartbeat |
  ViteDevToolsError

export interface ServerFunctions {
  getPayload: (force?: boolean) => Promise<ViteDevToolsPayload>
  openInEditor: (filename: string) => void
  openInFinder: (filename: string) => void
}

export interface ViteDevToolsConfig {
  /**
   * The name of the project
   */
  name?: string
}

export type RemoveVoidKeysFromObject<T> = { [K in keyof T]: T[K] extends void ? never : K } extends { [_ in keyof T]: never } ? T : { [K in keyof T as T[K] extends void ? never : K]: T[K] }

export interface ClientFunctions {}

export type ServerFunctionsDump = Omit<
  RemoveVoidKeysFromObject<{
    [K in keyof ServerFunctions]: Awaited<ReturnType<ServerFunctions[K]>>
  }>,
  'getPublint' | 'getPackagesNpmMeta' | 'getPackagesNpmMetaLatest'
>

export interface ConnectionMeta {
  backend: 'websocket' | 'static'
  websocket?: number
}
