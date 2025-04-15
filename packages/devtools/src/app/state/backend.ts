import type { Backend } from '../types/backend'
import { shallowRef } from 'vue'

export const backend = shallowRef<Backend | null>(null)
