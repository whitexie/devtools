<script setup lang="ts">
import { toggleDark } from '~/composables/dark'
</script>

<template>
  <div
    flex="~ gap-2" items-center justify-center fixed top-4 right-4 bg-glass
    z-panel-nav border="~ rounded-xl base"
  >
    <button
      v-tooltip="'Toggle dark mode'"
      title="Toggle dark mode"
      rounded-full p2 hover:bg-active op-fade hover:op100
      flex="~ items-center justify-center"
      @click="toggleDark()"
    >
      <div i-ph-sun-duotone dark:i-ph-moon-duotone />
    </button>
  </div>
</template>
