<script setup lang="ts">
import type { ModuleListItem, SessionContext } from '../../types/data'
import { useRoute } from '#app/composables/router'
import { computed, onMounted, reactive, shallowRef } from 'vue'
import { backend } from '../../state/backend'

const params = useRoute().params as {
  session: string
}

const session = reactive({
  id: computed(() => params.session),
  modulesList: shallowRef<ModuleListItem[]>([]),
}) as SessionContext

onMounted(async () => {
  session.modulesList = await backend.value!.functions['vite:rolldown:get-module-list']!({
    session: params.session,
  })
})
</script>

<template>
  <NuxtPage :session="session" />
</template>
