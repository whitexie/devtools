<script setup lang="ts">
import type { ModuleListItem, SessionContext } from '../../types/data'
import { useRoute } from '#app/composables/router'
import { computed, onMounted, reactive, shallowRef } from 'vue'
import { backend } from '../../state/backend'
import { getFileTypeFromName } from '../../utils/icon'

const params = useRoute().params as {
  session: string
}

const session = reactive({
  id: computed(() => params.session),
  modulesList: shallowRef<ModuleListItem[]>([]),
}) as SessionContext

onMounted(async () => {
  const modules = await backend.value!.functions['vite:rolldown:get-module-list']!({
    session: params.session,
  })
  session.modulesList = modules.map(mod => ({
    id: mod.id,
    fileType: getFileTypeFromName(mod.id).name,
  }))
})
</script>

<template>
  <NuxtPage :session="session" />
</template>
