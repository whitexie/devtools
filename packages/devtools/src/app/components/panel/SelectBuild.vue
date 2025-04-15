<script setup lang="ts">
import { backend } from '../../state/backend'

const builds = await backend.value!.functions['vite:rolldown:list-builds']()
</script>

<template>
  <div flex="~ col gap-2">
    <NuxtLink
      v-for="build of builds"
      :key="build.id"
      :to="`/build/${build.id}`"
      hover="bg-active"
      border="~ base rounded-md"
      p="x-2 y-1"
    >
      {{ build.id }}
    </NuxtLink>
  </div>
</template>
