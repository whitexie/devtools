<script setup lang="ts">
import { useHead } from '#app/composables/head'
import { useNuxtApp } from '#app/nuxt'
import { useServerConnectionInfo } from '#imports'

import 'floating-vue/dist/style.css'
import './styles/cm.css'
import './styles/splitpanes.css'
import './styles/global.css'
import './composables/dark'

useHead({
  title: 'Vite DevTools',
})

const connectionInfo = useServerConnectionInfo()
const { $connectToServer } = useNuxtApp()

$connectToServer()
</script>

<template>
  <div v-if="connectionInfo.error" text-red>
    {{ connectionInfo.error }}
  </div>
  <div
    v-else-if="!connectionInfo.connected"
    p10 h-full flex="~ col" items-center justify-center
  >
    <VisualLogoBanner />
    <div flex="~ gap-2" mt--4 items-center justify-center>
      <div i-svg-spinners-8-dots-rotate />
      <span animate-pulse>Connecting...</span>
    </div>
  </div>
  <div v-else>
    <NuxtPage />
  </div>
</template>
