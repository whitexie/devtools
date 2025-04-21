<script setup lang="ts">
import { useRoute } from '#app/composables/router'
import { onMounted, shallowRef } from 'vue'
import { backend } from '../../../state/backend'

const params = useRoute().params as {
  build: string
}

const modules = shallowRef<{ id: string }[]>([])

onMounted(async () => {
  modules.value = await backend.value!.functions['vite:rolldown:get-module-list']!({
    build: params.build,
  })
})
</script>

<template>
  <div flex="~ col gap-2" p4>
    <template v-for="mod of modules" :key="mod">
      <NuxtLink
        :to="{ path: `/build/${params.build}/flow`, query: { module: mod.id } }"
        hover="bg-active" block px2 p1
        border="~ base rounded"
      >
        <DisplayModuleId :id="mod.id" />
      </NuxtLink>
    </template>
  </div>
</template>
