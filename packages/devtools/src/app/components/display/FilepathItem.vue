<script setup lang="ts">
import { computed } from 'vue'
import { parseReadablePath } from '../../utils/filepath'

const props = defineProps<{
  filepath?: string
  lineBreak?: boolean
  subpath?: boolean
  override?: string
}>()

const root = '/Users/antfu/i/vite-devtools/' // TODO: get from cwd
const parsed = computed(() => (props.filepath && root)
  ? parseReadablePath(props.filepath, root)
  : { path: props.filepath || '' })
</script>

<template>
  <span flex="~ gap-2 items-center" class="group">
    <span
      :class="[
        lineBreak ? '' : 'ws-nowrap of-hidden truncate',
      ]"
      font-mono
      :title="override || filepath"
    >
      <template v-if="override">
        {{ override }}
      </template>
      <template v-else-if="parsed.moduleName">
        <span>{{ parsed.moduleName }}</span>
        <span v-if="subpath" op50>
          {{ parsed.path.slice(parsed.moduleName.length) }}
        </span>
      </template>
      <template v-else>
        {{ parsed.path }}
      </template>
    </span>
    <slot />
  </span>
</template>
