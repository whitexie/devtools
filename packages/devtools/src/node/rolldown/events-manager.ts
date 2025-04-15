import type { Action, Event } from '@rolldown/debug'

export type RolldownEvent = Action & {
  event_id: string
  timestamp: string
}

export class RolldownEventsManager {
  events: RolldownEvent[] = []

  handleEvent(raw: Event) {
    const event = {
      ...raw.fields.action,
      event_id: `${raw.timestamp}#${this.events.length}`,
      timestamp: raw.timestamp,
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
