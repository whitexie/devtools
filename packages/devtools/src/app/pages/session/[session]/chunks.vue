<script setup lang="ts">
import type { SessionContext } from '~~/shared/types'
import { useRpc } from '#imports'
import { useAsyncState } from '@vueuse/core'

const props = defineProps<{
  session: SessionContext
}>()

const rpc = useRpc()
const { state: chunks } = useAsyncState(
  async () => {
    return await rpc.value!['vite:rolldown:get-chunks-graph']?.({
      session: props.session.id,
    })
  },
  null,
)
</script>

<template>
  <div p5 flex="~ col gap-2">
    Chunks
    <!-- <pre>{{ chunks }}</pre> -->

    <template v-for="chunk of chunks" :key="chunk.id">
      <div border="~ base rounded" flex="~ col gap-3" p2>
        <div flex="~ gap-1 items-center">
          <div flex="~ gap-1 items-center">
            <div i-ph-hash-duotone />
            <span>{{ chunk.name }}</span>
            <span>{{ chunk.chunk_id }}</span>
            <DisplayBadge :text="chunk.reason" />
          </div>
          <div flex-auto />
          <div flex="~ gap-1 items-center">
            <div i-ph-package-duotone />
            {{ chunk.modules.length }}
          </div>
        </div>
        <div flex="~ col gap-1" ws-nowrap>
          <DisplayModuleId
            v-for="module of chunk.modules"
            :id="module"
            :key="module"
            :session
            :link="true"
            :minimal="true"
            hover="bg-active"
            border="~ base rounded" px2 py1 w-full
          />
        </div>
      </div>
    </template>
  </div>
</template>
