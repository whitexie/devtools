<script setup lang="ts">
const props = defineProps<{
  lines?: {
    top?: boolean
    bottom?: boolean
  }
  classNodeInline?: string
  classNodeOuter?: string
  classNodeInner?: string
}>()
</script>

<template>
  <div flex="~ col" relative>
    <div v-if="props.lines?.top" absolute top-0 left-10 border="r base" h="1/2" max-h-4 z-flowmap-line />
    <div v-if="props.lines?.bottom" absolute bottom-0 left-10 border="r base" h="1/2" max-h-4 z-flowmap-line />
    <slot name="before" />
    <div flex="~" :class="props.classNodeInline">
      <div :class="props.classNodeOuter" border="~ base rounded-full" bg-base of-hidden>
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
