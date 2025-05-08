<script setup lang="ts">
import { vTooltip } from 'floating-vue'
import { relative } from 'pathe'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id?: string
    badges?: boolean
    icon?: boolean
  }>(),
  {
    icon: true,
  },
)

// const mod = computed(() => payload.modules.find(i => i.id === props.id))
const root = '/Users/antfu/i/vite-devtools/' // TODO: get from cwd
// const isVirtual = computed(() => mod.value?.virtual)
const relativePath = computed(() => {
  if (!props.id)
    return ''
  const id = props.id.replace(/%2F/g, '/')
  let relate = relative(root, id)
  if (!relate.startsWith('.'))
    relate = `./${relate}`
  if (relate.startsWith('./'))
    return relate
  if (relate.match(/^(?:\.\.\/){1,3}[^.]/))
    return relate
  return id
})

const containerClass = computed(() => {
  return 'flex items-center'
})
</script>

<template>
  <div
    v-if="id"
    v-tooltip.bottom-start="{
      content: props.id,
      triggers: ['hover', 'focus'],
    }"
    my-auto text-sm font-mono
    :class="containerClass"
  >
    <DisplayFileIcon v-if="icon" :filename="id" mr1.5 />
    <span>
      <DisplayHighlightedPath :path="relativePath" />
    </span>
    <slot />
    <!-- <DisplayBadge
      v-if="isVirtual"
      class="ml1"
      text="virtual"
    /> -->
  </div>
</template>
