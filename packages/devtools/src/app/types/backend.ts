import type { Ref } from 'vue'
import type { ServerFunctions } from '../../node/rpc'

export type Functions =
  & Partial<ServerFunctions>
  & Pick<ServerFunctions, 'vite:get-payload'>

export interface Backend {
  name: string
  status: Ref<'idle' | 'connecting' | 'connected' | 'error'>
  connectionError: Ref<unknown | undefined>
  connect: () => Promise<void> | void
  isDynamic?: boolean
  functions: Functions
}
