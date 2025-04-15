import type { DefinitionsToFunctions, FilterDefinitions } from './types'
import { getPayload } from './functions/get-payload'
import { openInEditor } from './functions/open-in-editor'
import { openInFinder } from './functions/open-in-finder'
import { rolldownGetRawEvents } from './functions/rolldown-get-raw-events'
import { rolldownListBuilds } from './functions/rolldown-list-builds'

export const rpcFunctions = [
  openInEditor,
  openInFinder,
  getPayload,
  rolldownListBuilds,
  rolldownGetRawEvents,
] as const

export type ServerFunctions = DefinitionsToFunctions<typeof rpcFunctions>

export type ServerFunctionsStatic = DefinitionsToFunctions<
  FilterDefinitions<typeof rpcFunctions, 'static'>
>

export type ServerFunctionsDump = {
  [K in keyof ServerFunctionsStatic]: Awaited<ReturnType<ServerFunctionsStatic[K]>>
}
