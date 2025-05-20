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
  rootDir: '',
  modulesList: shallowRef<ModuleListItem[]>([]),
}) as SessionContext

onMounted(async () => {
  const summary = await backend.value!.functions['vite:rolldown:get-session-summary']!({
    session: params.session,
  })
  session.rootDir = summary.rootDir
  session.modulesList = summary.modules.map(mod => ({
    id: mod.id,
    fileType: getFileTypeFromName(mod.id).name,
    imports: mod.imports ?? [],
    importers: mod.importers ?? [],
  }))
})
</script>

<template>
  <NuxtPage :session="session" />
</template>
