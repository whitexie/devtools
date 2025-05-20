import type { Event, Module as ModuleInfo } from '@rolldown/debug'

export type RolldownEvent = Event & {
  event_id: string
}

export class RolldownEventsManager {
  events: RolldownEvent[] = []
  modules: Map<string, ModuleInfo> = new Map()

  handleEvent(raw: Event) {
    const event = {
      ...raw,
      event_id: `${raw.timestamp}#${this.events.length}`,
    }
    this.events.push(event)

    if ('module_id' in event) {
      if (this.modules.has(event.module_id))
        return
      this.modules.set(event.module_id, {
        id: event.module_id,
        is_external: false,
        imports: [],
        importers: [],
      })
    }
    if (event.action === 'ModuleGraphReady') {
      for (const module of event.modules) {
        this.modules.set(module.id, module)
        module.importers = Array.from(new Set(module.importers || [])).sort((a, b) => a.localeCompare(b))
        module.imports = Array.from(new Set(module.imports || [])).sort((a, b) => a.localeCompare(b))
      }
    }

    return event
  }

  dispose() {
    this.events = []
  }

  [Symbol.dispose]() {
    this.dispose()
  }
}
