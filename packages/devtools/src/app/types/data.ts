import type { ModuleImport } from '@rolldown/debug'

export type { ModuleImport }

export interface ModuleListItem {
  id: string
  fileType: string
  imports: ModuleImport[]
  importers: string[]
}

export interface SessionContext {
  id: string
  rootDir: string
  modulesList: ModuleListItem[]
}
