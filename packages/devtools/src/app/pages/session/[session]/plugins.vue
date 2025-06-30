<script setup lang="ts">
import type { SessionContext } from '~~/shared/types'

defineProps<{
  session: SessionContext
}>()
</script>

<template>
  <div p4>
    <div py2 op50>
      Plugins ({{ session.meta.plugins.length }})
    </div>

    <div flex="~ col gap-1">
      <template v-for="plugin in session.meta.plugins" :key="plugin.id">
        <div font-mono>
          <DisplayPluginName :name="plugin.name" />
        </div>
      </template>
    </div>
  </div>
</template>
