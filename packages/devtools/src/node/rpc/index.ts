import type { DefinitionsToFunctions, FilterDefinitions } from './types'
import { getPayload } from './functions/get-payload'
import { openInEditor } from './functions/open-in-editor'
import { openInFinder } from './functions/open-in-finder'
import { rolldownGetModuleInfo } from './functions/rolldown-get-module-info'
import { rolldownGetModuleList } from './functions/rolldown-get-module-list'
import { rolldownGetModuleRawEvents } from './functions/rolldown-get-module-raw-events'
import { rolldownGetRawEvents } from './functions/rolldown-get-raw-events'
import { rolldownListSessions } from './functions/rolldown-list-sessions'

export const rpcFunctions = [
  openInEditor,
  openInFinder,
  getPayload,
  rolldownListSessions,
  rolldownGetRawEvents,
  rolldownGetModuleList,
  rolldownGetModuleInfo,
  rolldownGetModuleRawEvents,
] as const

export type ServerFunctions = DefinitionsToFunctions<typeof rpcFunctions>

export type ServerFunctionsStatic = DefinitionsToFunctions<
  FilterDefinitions<typeof rpcFunctions, 'static'>
>

export type ServerFunctionsDump = {
  [K in keyof ServerFunctionsStatic]: Awaited<ReturnType<ServerFunctionsStatic[K]>>
}
