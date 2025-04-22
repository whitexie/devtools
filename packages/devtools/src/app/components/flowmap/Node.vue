<script setup lang="ts">
const props = defineProps<{
  lines?: {
    top?: boolean
    bottom?: boolean
  }
  classNodeInline?: string
  classNodeOuter?: string
  classNodeInner?: string
  active?: boolean
}>()
</script>

<template>
  <div flex="~ col" relative>
    <div
      v-if="props.lines?.top" absolute top-0 left-10 border="r" h="1/2" max-h-4 z-flowmap-line
      :class="active ? 'border-flowmap-active' : 'border-base'"
    />
    <div
      v-if="props.lines?.bottom" absolute bottom-0 left-10 border="r" h="1/2" max-h-4 z-flowmap-line
      :class="active ? 'border-flowmap-active' : 'border-base'"
    />
    <slot name="before" />
    <div flex="~" :class="props.classNodeInline">
      <slot name="inline-before" />
      <div
        :class="[
          props.classNodeOuter,
          active ? 'border-flowmap-active' : 'border-base',
        ]"
        border="~ rounded-full" bg-base of-hidden
      >
        <slot name="inner">
          <div px3 py1 :class="props.classNodeInner" flex="~ inline gap-2 items-center">
            <slot name="content" />
          </div>
        </slot>
      </div>
      <slot name="inline-after" />
    </div>
    <slot name="after" />
  </div>
</template>
