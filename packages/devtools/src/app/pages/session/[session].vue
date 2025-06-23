<script setup lang="ts">
import type { ModuleListItem, SessionContext } from '~~/shared/types'
import { useRoute } from '#app/composables/router'
import { useRpc } from '#imports'
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
import { useSideNav } from '~/state/nav'
import { getFileTypeFromName } from '~/utils/icon'

const params = useRoute().params as {
  session: string
}

const isLoading = ref(true)
const session = reactive({
  id: computed(() => params.session),
  rootDir: '',
  modulesList: shallowRef<ModuleListItem[]>([]),
}) as SessionContext
const rpc = useRpc()

useSideNav(() => {
  if (!session.rootDir)
    return []
  return [
    {
      title: 'Home',
      to: `/session/${session.id}`,
      icon: 'i-ph-house-duotone',
    },
    {
      title: 'Modules Graph',
      to: `/session/${session.id}/graph`,
      icon: 'i-ph-graph-duotone',
    },
    {
      title: 'Bundle Analysis',
      to: `/session/${session.id}/bundle`,
      icon: 'i-ph-package-duotone',
    },
    {
      title: 'Raw Data',
      to: `/session/${session.id}/raw`,
      icon: 'i-ph-file-duotone',
    },
  ]
})

onMounted(async () => {
  const summary = await rpc.value!['vite:rolldown:get-session-summary']!({
    session: params.session,
  })
  session.rootDir = summary.rootDir
  session.modulesList = summary.modules.map(mod => ({
    id: mod.id,
    fileType: getFileTypeFromName(mod.id).name,
    imports: mod.imports ?? [],
    importers: mod.importers ?? [],
  }))
  isLoading.value = false
})
</script>

<template>
  <VisualLoading v-if="isLoading" />
  <div v-else grid="~ cols-[max-content_1fr]" h-screen w-screen max-w-screen max-h-screen of-hidden>
    <PanelSideNav />
    <div of-auto h-screen max-h-screen relative>
      <NuxtPage :session="session" />
    </div>
  </div>
</template>
