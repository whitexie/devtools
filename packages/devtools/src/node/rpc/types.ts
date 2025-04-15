/**
 * Type of the RPC function,
 * - static: A function that returns a static data (can be cached and dumpped)
 * - action: A function that performs an action (no data returned)
 * - query: A function that queries a resource
 */
export type RpcFunctionType = 'static' | 'action' | 'query'

export type Thenable<T> = T | Promise<T>

export interface RpcFunctionDefinition<
  NAME extends string,
  TYPE extends RpcFunctionType,
  ARGS extends any[],
  RETURN = void,
> {
  name: NAME
  type: TYPE
  setup: (context: RpcContext) => Thenable<{
    handler: (...args: ARGS) => RETURN
  }>
}

export interface RpcContext {
  cwd: string
  mode: 'dev' | 'build'
}

export function defineRpcFunction<
  NAME extends string,
  TYPE extends RpcFunctionType,
  ARGS extends any[],
  RETURN = void,
>(
  definition: RpcFunctionDefinition<NAME, TYPE, ARGS, RETURN>,
): RpcFunctionDefinition<NAME, TYPE, ARGS, RETURN> {
  return definition
}

export type EntriesToObject<T extends readonly [string, any][]> = {
  [K in T[number] as K[0]]: K[1]
}

export type DefinitionsToFunctions<T extends readonly RpcFunctionDefinition<any, any, any>[]> = EntriesToObject<{
  [K in keyof T]: [T[K]['name'], Awaited<ReturnType<T[K]['setup']>>['handler']]
}>

export type FilterDefinitions<
  T extends readonly RpcFunctionDefinition<any, any, any>[],
  Type extends RpcFunctionType,
> = {
  [K in keyof T]: T[K] extends { type: Type } ? T[K] : never
}

// type a = DefinitionsToFunctions<
//   FilterDefinitions<[
//     {
//       name: 'a'
//       type: 'static'
//       setup: () => ({
//         handler: () => void
//       })
//     },
//     {
//       name: 'b'
//       type: 'action'
//       setup: () => ({
//         handler: (a: string) => void
//       })
//     },
//   ], 'action' | 'static'>
// >
