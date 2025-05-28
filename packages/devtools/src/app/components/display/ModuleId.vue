<script setup lang="ts">
import type { ModuleImport } from '@rolldown/debug'
import type { SessionContext } from '../../types/data'
import { useRoute } from '#app/composables/router'
import { NuxtLink } from '#components'
import { Tooltip } from 'floating-vue'
import { relative } from 'pathe'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    badges?: boolean
    icon?: boolean
    link?: boolean
    minimal?: boolean
    kind?: ModuleImport['kind']
    session: SessionContext
  }>(),
  {
    icon: true,
  },
)

const route = useRoute()
const location = window.location

const relativePath = computed(() => {
  if (!props.id)
    return ''
  const id = props.id.replace(/%2F/g, '/')
  let relate = relative(props.session!.rootDir, id)
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
  <component
    :is="link ? NuxtLink : 'div'"
    :to="link ? { path: route.path, query: { ...route.query, module: id }, hash: location.hash } : undefined"
  >
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
          <DisplayHighlightedPath :path="relativePath" :minimal="minimal" />
        </span>
        <slot />
        <DisplayBadge
          v-if="kind"
          class="ml1"
          :text="kind"
        />
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
  </component>
</template>
