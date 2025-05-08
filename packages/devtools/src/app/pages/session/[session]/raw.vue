<script setup lang="ts">
import type { SessionContext } from '../../../types/data'
import { useRoute } from '#app/composables/router'
import { useAsyncState } from '@vueuse/core'
import { backend } from '../../../state/backend'

const props = defineProps<{
  session: SessionContext
}>()
const query = useRoute().query

const events = useAsyncState(
  async () => {
    return await backend.value!.functions['vite:rolldown:get-module-raw-events']?.({
      session: props.session.id,
      module: query.module as string,
    })
  },
  {
    events: [],
  },
)
</script>

<template>
  <div>
    <DataRawEventsTable v-if="events.state.value" :events="events.state.value.events" />
  </div>
</template>
