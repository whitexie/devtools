<script setup lang="ts">
import { Tooltip } from 'floating-vue'
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
  <Tooltip
    my-auto text-sm font-mono block w-full
    :triggers="['hover']"
    :delay="1200"
    :disabled="(props.id?.length || 0) < 30"
    placement="bottom-start"
  >
    <div
      v-if="id"
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
    <template #popper>
      <span font-mono text-sm>
        {{ props.id }}
      </span>
    </template>
  </Tooltip>
</template>
