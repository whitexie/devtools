<script setup lang="ts">
import { computed } from 'vue'
import { isDark } from '../../composables/dark'
import { getFileTypeFromModuleId } from '../../utils/icon'

const props = defineProps<{
  filename: string
}>()

const info = computed(() => getFileTypeFromModuleId(props.filename))
</script>

<template>
  <div
    flex-none
    :title="info.description || info.name"
    :class="[info.icon, isDark ? '' : 'brightness-60 hue-rotate-180 invert-100 saturate-200']"
  />
</template>
