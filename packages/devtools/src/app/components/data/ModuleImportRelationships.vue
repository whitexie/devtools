<script setup lang="ts">
import type { ModuleInfo, SessionContext } from '~~/shared/types'

defineProps<{
  module: ModuleInfo
  session: SessionContext
}>()
</script>

<template>
  <div>
    Module Imports Relationships (TODO)
  </div>
</template>
