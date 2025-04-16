<script setup lang="ts">
import { useRoute } from '#app/composables/router'
import { useAsyncState } from '@vueuse/core'
import { backend } from '../../../state/backend'

const params = useRoute().params as {
  build: string
}
const query = useRoute().query

const events = useAsyncState(
  async () => {
    return await backend.value!.functions['vite:rolldown:get-module-info']?.({
      build: params.build as string,
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
