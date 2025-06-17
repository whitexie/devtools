import type { Event, Module as ModuleInfo } from '@rolldown/debug'

export type RolldownEvent = Event & {
  event_id: string
}

export class RolldownEventsManager {
  events: RolldownEvent[] = []
  modules: Map<string, ModuleInfo> = new Map()
  source_refs: Map<string, string> = new Map()

  interpretSourceRefs(event: Event, key: string) {
    if (key in event && typeof event[key as keyof Event] === 'string') {
      if (event[key as keyof Event].startsWith('$ref:')) {
        const refKey = event[key as keyof Event].slice(5)
        if (this.source_refs.has(refKey)) {
          (event as any)[key] = this.source_refs.get(refKey)
        }
      }
    }
  }

  handleEvent(raw: Event) {
    const event = {
      ...raw,
      event_id: `${'timestamp' in raw ? raw.timestamp : 'x'}#${this.events.length}`,
    }
    this.events.push(event)

    if (event.action === 'StringRef') {
      this.source_refs.set(event.id, event.content)
      return
    }

    this.interpretSourceRefs(event, 'source')
    this.interpretSourceRefs(event, 'transformed_source')

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
        module.imports = Array.from(new Set(module.imports || [])).sort((a, b) => a.id.localeCompare(b.id))
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
