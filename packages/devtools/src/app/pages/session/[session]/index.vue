<script setup lang="ts">
import type { SessionContext } from '../../../types/data'
import { useRoute, useRouter } from '#app/composables/router'
import { clearUndefined } from '@antfu/utils'
import { computedWithControl, debouncedWatch } from '@vueuse/core'
import Fuse from 'fuse.js'
import { computed, reactive } from 'vue'
import { parseReadablePath } from '../../../utils/filepath'
import { getFileTypeFromModuleId, getFileTypeFromName } from '../../../utils/icon'

const props = defineProps<{
  session: SessionContext
}>()

interface Filters {
  search: string
  file_types: string[] | null
  node_modules: string[] | null
}

const route = useRoute()
const router = useRouter()

const filters = reactive<Filters>({
  search: (route.query.search || '') as string,
  file_types: (route.query.file_types || null) as string[] | null,
  node_modules: (route.query.node_modules || null) as string[] | null,
})

debouncedWatch(
  filters,
  (f) => {
    const query: any = {
      ...route.query,
      search: f.search || undefined,
      file_types: f.file_types || undefined,
      node_modules: f.node_modules || undefined,
    }
    router.replace({
      query: clearUndefined(query),
    })
  },
  { debounce: 500 },
)

const parsedPaths = computed(() => props.session.modulesList.map((mod) => {
  const path = parseReadablePath(mod.id, props.session.rootDir)
  const type = getFileTypeFromModuleId(mod.id)
  return {
    mod,
    path,
    type,
  }
}))

// const allNodeModules = computed(() => {
//   const nodeModules = new Set<string>()
//   for (const mod of parsedPaths.value) {
//     if (mod.path.moduleName)
//       nodeModules.add(mod.path.moduleName)
//   }
//   return nodeModules
// })

const allFileTypes = computed(() => {
  const fileTypes = new Set<string>()
  for (const mod of parsedPaths.value) {
    fileTypes.add(mod.type.name)
  }
  return fileTypes
})

const filtered = computed(() => {
  let modules = parsedPaths.value
  if (filters.file_types) {
    modules = modules.filter(mod => filters.file_types!.includes(mod.type.name))
  }
  if (filters.node_modules) {
    modules = modules.filter(mod => mod.path.moduleName && filters.node_modules!.includes(mod.path.moduleName))
  }
  return modules.map(mod => mod.mod)
})

function isFileTypeSelected(type: string) {
  return filters.file_types == null || filters.file_types.includes(type)
}

function toggleFileType(type: string) {
  if (filters.file_types == null) {
    filters.file_types = Array.from(allFileTypes.value)
  }

  if (filters.file_types.includes(type)) {
    filters.file_types = filters.file_types.filter(t => t !== type)
  }
  else {
    filters.file_types.push(type)
  }
  if (filters.file_types.length === allFileTypes.value.size) {
    filters.file_types = null
  }
}

const fuse = computedWithControl(
  () => filtered.value,
  () => new Fuse(filtered.value, {
    includeScore: true,
    keys: ['id'],
  }),
)

const searched = computed(() => {
  if (filters.search === '') {
    return filtered.value
  }
  return fuse.value
    .search(filters.search)
    .map(r => r.item)
})
</script>

<template>
  <div flex="~ col gap-2" p4>
    <div flex="col gap-2">
      <div>
        <input
          v-model="filters.search"
          border="~ base rounded-full"
          p2 px4 w-full outline-none
          placeholder="Search"
        >
      </div>
      <div flex="~ gap-2" py2>
        <label
          v-for="type of allFileTypes"
          :key="type"
          border="~ base rounded" px2 py1
          flex="~ items-center gap-1"
          :title="type"
          :class="isFileTypeSelected(type) ? 'bg-active' : 'grayscale op50'"
        >
          <input
            type="checkbox"
            :checked="isFileTypeSelected(type)"
            mr1
            @change="toggleFileType(type)"
          >
          <div :class="getFileTypeFromName(type).icon" />
          <div text-sm>{{ getFileTypeFromName(type).description }}</div>
        </label>
      </div>
      <!-- TODO: should we add filters for node_modules? -->
      <!-- {{ allNodeModules }} -->
    </div>
    <template v-for="mod of searched" :key="mod">
      <DisplayModuleId
        :id="mod.id"
        :session
        hover="bg-active" block px2 p1
        border="~ base rounded"
        :link="true"
      />
    </template>
    <div text-center text-xs op50 m4>
      {{ filtered.length }} of {{ session.modulesList.length }}
    </div>
  </div>
</template>
