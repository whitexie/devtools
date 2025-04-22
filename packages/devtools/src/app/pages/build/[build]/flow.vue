<script setup lang="ts">
import { useRoute } from '#app/composables/router'
import { useAsyncState } from '@vueuse/core'
import { backend } from '../../../state/backend'

const params = useRoute().params as {
  build: string
}
const query = useRoute().query

const { state: info } = useAsyncState(
  async () => {
    return await backend.value!.functions['vite:rolldown:get-module-info']?.({
      session: params.build as string,
      module: query.module as string,
    })
  },
  null,
)
</script>

<template>
  <FlowmapModuleFlow v-if="info" p4 :info="info" />
</template>
