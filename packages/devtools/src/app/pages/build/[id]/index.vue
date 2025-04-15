<script setup lang="ts">
import type { Event } from '@rolldown/debug'
import { useRoute } from '#app/composables/router'
import { onMounted, shallowRef } from 'vue'
import { backend } from '~/state/backend'

const params = useRoute().params

const events = shallowRef<Event[]>([])

onMounted(async () => {
  events.value = await backend.value!.functions['vite:rolldown:get-raw-events']({
    buildId: params.id,
  })
})
</script>

<template>
  <div>
    {{ params }}
    {{ events }}
  </div>
</template>
