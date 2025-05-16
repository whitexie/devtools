export interface ModuleListItem {
  id: string
  fileType: string
}

export interface SessionContext {
  id: string
  rootDir: string
  modulesList: ModuleListItem[]
}
