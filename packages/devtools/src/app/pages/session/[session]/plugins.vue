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

    <!--
      TODO: plugins framegraph
        Two different views direction:
          - plugins -> hooks -> modules
          - modules -> hooks -> plugins
    -->
    <div flex="~ col gap-1">
      <template v-for="plugin in session.meta.plugins" :key="plugin.id">
        <div font-mono border="~ rounded base" px2 py1 text-sm hover="bg-active">
          <DisplayPluginName :name="plugin.name" />
        </div>
      </template>
    </div>
  </div>
</template>
