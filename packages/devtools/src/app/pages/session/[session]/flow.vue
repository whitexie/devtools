<script setup lang="ts">
import type { SessionContext } from '../../../types/data'
import { useRoute } from '#app/composables/router'
import { useAsyncState } from '@vueuse/core'
import { backend } from '../../../state/backend'

const props = defineProps<{
  session: SessionContext
}>()

const query = useRoute().query

const { state: info } = useAsyncState(
  async () => {
    return await backend.value!.functions['vite:rolldown:get-module-info']?.({
      session: props.session.id,
      module: query.module as string,
    })
  },
  null,
)
</script>

<template>
  <FlowmapModuleFlow
    v-if="info"
    p4
    :info
    :session
  />
</template>
