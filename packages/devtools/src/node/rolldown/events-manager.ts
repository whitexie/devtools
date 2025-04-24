import type { Event } from '@rolldown/debug'

export type RolldownEvent = Event & {
  event_id: string
}

export class RolldownEventsManager {
  events: RolldownEvent[] = []

  handleEvent(raw: Event) {
    const event = {
      ...raw,
      event_id: `${raw.timestamp}#${this.events.length}`,
    }
    this.events.push(event)
    return event
  }

  dispose() {
    this.events = []
  }

  [Symbol.dispose]() {
    this.dispose()
  }
}
