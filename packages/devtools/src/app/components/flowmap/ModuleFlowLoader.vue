<script setup lang="ts">
import type { SessionContext } from '~/types/data'
import { computedAsync } from '@vueuse/core'
import { backend } from '~/state/backend'

const props = defineProps<{
  session: SessionContext
  module: string
}>()

const info = computedAsync(async () => {
  const arg = {
    session: props.session.id,
    module: props.module,
  }
  return await backend.value!.functions['vite:rolldown:get-module-info']?.(arg)
})
</script>

<template>
  <div>
    <FlowmapModuleFlow
      v-if="info"
      p4
      :info
      :session
    />
    <div v-else>
      <!-- TODO: Better loading screen -->
      <div>Loading...</div>
    </div>
  </div>
</template>
