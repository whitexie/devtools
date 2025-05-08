<script setup lang="ts">
import type { SessionContext } from '../../../types/data'
import { computedWithControl } from '@vueuse/core'
import Fuse from 'fuse.js'
import { computed, reactive } from 'vue'

const props = defineProps<{
  session: SessionContext
}>()

const filters = reactive({
  search: '',
})

const fuse = computedWithControl(
  () => props.session.modulesList,
  () => new Fuse(props.session.modulesList, {
    includeScore: true,
    keys: ['id'],
  }),
)

const filtered = computed(() => {
  if (filters.search === '') {
    return props.session.modulesList
  }
  return fuse.value
    .search(filters.search)
    .map(r => r.item)
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
        :to="{ path: `/session/${session.id}/flow`, query: { module: mod.id } }"
        hover="bg-active" block px2 p1
        border="~ base rounded"
      >
        <DisplayModuleId :id="mod.id" />
      </NuxtLink>
    </template>
    <div text-center text-xs op50 m4>
      {{ filtered.length }} of {{ session.modulesList.length }}
    </div>
  </div>
</template>
