<script setup lang="ts">
import type { RolldownEvent } from '~/node/rpc/functions/rolldown-get-raw-events'
import { useRoute } from '#app/composables/router'
import { computed, onMounted, shallowRef } from 'vue'
import { backend } from '~/state/backend'

const params = useRoute().params

const events = shallowRef<RolldownEvent[]>([])

onMounted(async () => {
  events.value = await backend.value!.functions['vite:rolldown:get-raw-events']({
    buildId: params.id,
  })
})

const modules = computed(() => {
  const map = new Map<string, RolldownEvent[]>()
  for (const event of events.value) {
    if (!map.has(event.module_id)) {
      map.set(event.module_id, [])
    }
    map.get(event.module_id)!.push(event)
  }
  return map
})
</script>

<template>
  <table>
    <tbody>
      <tr v-for="[key, e] of modules.entries()" :key="key">
        <td>
          <UiFilepathItem :filepath="key" :subpath="true" />
        </td>
        <td>{{ e.length }}</td>
      </tr>
    </tbody>
  </table>
</template>
