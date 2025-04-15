import type { DefinitionsToFunctions, FilterDefinitions } from './types'
import { getPayload } from './functions/get-payload'
import { openInEditor } from './functions/open-in-editor'
import { openInFinder } from './functions/open-in-finder'

export const rpcFunctions = [
  openInEditor,
  openInFinder,
  getPayload,
] as const

export type ServerFunctions = DefinitionsToFunctions<typeof rpcFunctions>

export type ServerFunctionsStatic = DefinitionsToFunctions<
  FilterDefinitions<typeof rpcFunctions, 'static'>
>

export type ServerFunctionsDump = {
  [K in keyof ServerFunctionsStatic]: Awaited<ReturnType<ServerFunctionsStatic[K]>>
}
