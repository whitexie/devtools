<script setup lang="ts">
import { useHead } from '#app/composables/head'
import { shallowRef } from 'vue'
import { createDevBackend } from './backends/dev'
import { backend } from './state/backend'
import { fetchData, rawEvents } from './state/data'

import 'floating-vue/dist/style.css'
import './styles/global.css'
import './composables/dark'

useHead({
  title: 'Vite DevTools',
})

const error = shallowRef()

createDevBackend()
  .then(async (b) => {
    backend.value = b
    await b.connect()
    await fetchData(b)
    return b
  })
  .catch((e) => {
    console.error(e)
    error.value = e
  })
</script>

<template>
  <div>
    {{ rawEvents }}
  </div>
</template>
