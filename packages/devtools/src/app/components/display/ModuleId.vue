<script setup lang="ts">
import { vTooltip } from 'floating-vue'
import { relative } from 'pathe'
import { computed, defineComponent, h } from 'vue'
import { getPluginColor } from '../../utils/color'

const props = withDefaults(
  defineProps<{
    id?: string
    badges?: boolean
    icon?: boolean
    module?: boolean
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

const HighlightedPath = defineComponent({
  render() {
    const parts = relativePath.value.split(/([/?&:])/g)
    let type: 'start' | 'path' | 'query' = 'start'

    const classes: string[][] = parts.map(() => [])
    const nodes = parts.map((part) => {
      return h('span', { class: '' }, part)
    })

    const removeIndexes = new Set<number>()

    parts.forEach((part, index) => {
      const _class = classes[index]
      if (part === '?')
        type = 'query'

      if (type === 'start') {
        if (part.match(/^\.+$/)) {
          _class.push('op50')
        }
        else if (part === '/') {
          _class.push('op50')
        }
        else if (part !== '/') {
          type = 'path'
        }
      }

      if (type === 'path') {
        if (part === '/' || part === 'node_modules' || part.match(/^\.\w/)) {
          _class.push('op75')
        }
        if (part === '.pnpm') {
          classes[index]?.push('op50')
          if (nodes[index])
            nodes[index].children = '…'
          removeIndexes.add(index + 1)
          removeIndexes.add(index + 2)
          if (nodes[index + 4]?.children === 'node_modules') {
            removeIndexes.add(index + 3)
            removeIndexes.add(index + 4)
          }
        }
        if (part === ':') {
          if (nodes[index - 1]) {
            nodes[index - 1].props ||= {}
            nodes[index - 1].props!.style ||= {}
            nodes[index - 1].props!.style.color = getPluginColor(parts[index - 1])
          }
          _class.push('op50')
        }
        if (parts[index - 2] === 'node_modules' && !part.startsWith('.')) {
          _class.push('text-purple-5 dark:text-purple-4')
        }
      }

      if (type === 'query') {
        if (part === '?' || part === '&') {
          _class.push('text-orange-5 dark:text-orange-4')
        }
        else {
          _class.push('text-orange-9 dark:text-orange-2')
        }
      }
    })

    nodes.forEach((node, index) => {
      if (node.props)
        node.props.class = classes[index].join(' ')
    })

    Array.from(removeIndexes)
      .sort((a, b) => b - a)
      .forEach((index) => {
        nodes.splice(index, 1)
        classes.splice(index, 1)
      })

    return nodes
  },
})

const gridStyles = computed(() => {
  if (!props.module)
    return ''

  const gridColumns: string[] = []
  if (props.icon)
    gridColumns.push('min-content')

  if (props.module)
    gridColumns.push('minmax(0,1fr)')
  else
    gridColumns.push('100%')

  // todo: handle slot, not being used

  // if (isVirtual.value)
  //   gridColumns.push('min-content')

  return `grid-template-columns: ${gridColumns.join(' ')};`
})
const containerClass = computed(() => {
  return props.module
    ? 'grid grid-rows-1 items-center gap-1'
    : 'flex items-center'
})
</script>

<template>
  <div
    v-if="id"
    v-tooltip.bottom-start="{
      content: props.id,
      triggers: ['hover', 'focus'],
      disabled: !module,
    }"
    my-auto text-sm font-mono
    :class="containerClass"
    :style="gridStyles"
  >
    <DisplayFileIcon v-if="icon" :filename="id" mr1.5 />
    <span :class="{ 'overflow-hidden': module, 'text-truncate': module }">
      <HighlightedPath />
    </span>
    <slot />

    <!-- <DisplayBadge
      v-if="isVirtual"
      class="ml1"
      text="virtual"
    /> -->
  </div>
</template>
