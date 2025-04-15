import type { Backend } from '../types/backend'
import { ref } from 'vue'

export const rawEvents = ref<any>([])

export async function fetchData(backend: Backend) {
  rawEvents.value = await backend.functions.getPayload()
}
