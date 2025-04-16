<script setup lang="ts">
import { useRoute } from '#app/composables/router'

const params = useRoute().params
const query = useRoute().query
</script>

<template>
  <div>
    {{ params }}
    {{ query }}
  </div>
</template>
