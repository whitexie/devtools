<script setup lang="ts">
import type { SessionContext } from '../../../types/data'
import { useRoute } from '#app/composables/router'
import { computedAsync } from '@vueuse/core'
import { backend } from '../../../state/backend'

const props = defineProps<{
  session: SessionContext
}>()

const route = useRoute()

const info = computedAsync(async () => {
  const arg = {
    session: props.session.id,
    module: route.query.module as string,
  }
  return await backend.value!.functions['vite:rolldown:get-module-info']?.(arg)
})
</script>

<template>
  <FlowmapModuleFlow
    v-if="info"
    p4
    :info
    :session
  />
</template>
