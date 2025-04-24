<script setup lang="ts">
import { useRoute } from '#app/composables/router'
import Fuse from 'fuse.js'
import { computed, onMounted, reactive, shallowRef } from 'vue'
import { backend } from '../../../state/backend'

const params = useRoute().params as {
  session: string
}

const modules = shallowRef<{ id: string }[]>([])
const filters = reactive({
  search: '',
})

const fuse = new Fuse(modules.value, {
  includeScore: true,
  threshold: 0.2,
  keys: ['module_id'],
})

const filtered = computed(() => {
  if (filters.search === '') {
    return modules.value
  }
  return fuse.search(filters.search).map(r => r.item)
})

onMounted(async () => {
  modules.value = await backend.value!.functions['vite:rolldown:get-module-list']!({
    session: params.session,
  })
  fuse.setCollection(modules.value)
})
</script>

<template>
  <div flex="~ col gap-2" p4>
    <div>
      <input
        v-model="filters.search"
        border="~ base rounded-full"
        p2 px4 w-full outline-none
        placeholder="Search"
      >
    </div>
    <template v-for="mod of filtered" :key="mod">
      <NuxtLink
        :to="{ path: `/session/${params.session}/flow`, query: { module: mod.id } }"
        hover="bg-active" block px2 p1
        border="~ base rounded"
      >
        <DisplayModuleId :id="mod.id" />
      </NuxtLink>
    </template>
    <div text-center text-xs op50 m4>
      {{ filtered.length }} of {{ modules.length }}
    </div>
  </div>
</template>
