<script setup lang="ts">
import { useHead } from '#app/composables/head'

import 'floating-vue/dist/style.css'
import './styles/global.css'
import './composables/dark'

useHead({
  title: 'Vite DevTools',
})
</script>

<template>
  <div>
    Hello
  </div>
</template>
