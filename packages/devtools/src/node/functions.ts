import type { ServerFunctions } from './rpc/index'
import { rpcFunctions } from './rpc/index'

export interface CreateServerFunctionsOptions {
  cwd: string
  mode: 'dev' | 'build'
}

export async function createServerFunctions(options: CreateServerFunctionsOptions): Promise<ServerFunctions> {
  const functions = await Promise.all(
    rpcFunctions
      .map(async fn => [fn.name, (await fn.setup(options)).handler]),
  )
  return Object.fromEntries(functions)
}
