<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  expandable?: boolean
  classRootNode?: string
  activeStart?: boolean
  activeEnd?: boolean
}>()

const isExpanded = ref(true)
</script>

<template>
  <FlowmapNode
    :lines="{ top: true, bottom: !expandable || !isExpanded }" pl6 py2
    :class-node-outer="classRootNode"
    :active="activeStart"
  >
    <template #content>
      <slot name="node" />
    </template>

    <template v-if="expandable" #inline-before>
      <button
        w-6 h-6 mr1 ml--7 mya rounded-full hover="bg-active" flex="~ items-center justify-center"
        @click="isExpanded = !isExpanded"
      >
        <div i-ph-caret-right text-sm op50 transition duration-300 :class="{ 'rotate-90': isExpanded }" />
      </button>
    </template>

    <template v-if="expandable && isExpanded" #after>
      <div mb--1px>
        <div h-8 relative mb--1px translate-x-1px>
          <div :class="activeStart ? 'border-flowmap-active' : 'border-base'" border="l b rounded-lb-2xl" h-5 absolute left-4 w-3 top-0 />
          <div :class="activeStart ? 'border-flowmap-active' : 'border-base'" border="r t rounded-rt-2xl" h-3 absolute left-7 w-3 top-5 translate-y--1px />
        </div>
        <slot name="container" />
        <div h-6 relative mb--2>
          <div :class="activeEnd ? 'border-flowmap-active' : 'border-base'" border="b r rounded-br-2xl" h-3 absolute left-7 w-3 top-0 translate-x-1px />
          <div :class="activeEnd ? 'border-flowmap-active' : 'border-base'" border="t l rounded-lt-2xl" h-3 absolute left-4 w="[calc(0.75rem+1px)]" top-3 translate-y--1px />
        </div>
      </div>
    </template>
  </FlowmapNode>
</template>
