<script setup lang="ts">
import { backend } from '../../state/backend'

const sessions = await backend.value!.functions['vite:rolldown:list-sessions']()
</script>

<template>
  <div flex="~ col gap-2">
    <NuxtLink
      v-for="session of sessions"
      :key="session.id"
      :to="`/session/${session.id}`"
      hover="bg-active"
      border="~ base rounded-md"
      p="x-2 y-1" font-mono
    >
      {{ session.id }}
    </NuxtLink>
  </div>
</template>
