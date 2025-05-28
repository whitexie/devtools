<script setup lang="ts">
import type { SessionContext } from '~/types/data'

defineProps<{
  session: SessionContext
}>()
</script>

<template>
  <div flex="~ col gap-2" p4>
    <div border="~ base rounded" p4 flex="~ gap-2">
      <div>
        {{ session.id }}
      </div>
      <div>
        {{ session.rootDir }}
      </div>
      <div>
        {{ session.modulesList.length }} modules
      </div>
    </div>
    <div flex="~ gap-2">
      <NuxtLink btn-action :to="{ path: `/session/${session.id}/graph` }">
        Modules Graph
      </NuxtLink>
      <NuxtLink btn-action :to="{ path: `/session/${session.id}/bundle` }">
        Bundle Analysis
      </NuxtLink>
      <NuxtLink btn-action :to="{ path: `/session/${session.id}/raw` }">
        Raw Data
      </NuxtLink>
    </div>
  </div>
</template>
