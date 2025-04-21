<script setup lang="ts" generic="T">
import { ref } from 'vue'

defineProps<{
  items: T[]
}>()

const isExpanded = ref(true)
</script>

<template>
  <FlowmapNode
    :lines="{ top: true, bottom: items.length === 0 || !isExpanded }" pl6 py2
    :class-node-outer="items.length === 0 ? 'border-dashed' : ''"
  >
    <template #content>
      <slot name="node" />
      <span op50 text-xs>({{ items.length }})</span>
    </template>

    <template v-if="items.length > 0" #inline-before>
      <button
        w-6 h-6 mr1 ml--7 mya rounded-full hover="bg-active" flex="~ items-center justify-center"
        @click="isExpanded = !isExpanded"
      >
        <div i-ph-caret-right text-sm op50 transition duration-300 :class="{ 'rotate-90': isExpanded }" />
      </button>
    </template>

    <template v-if="items.length > 0 && isExpanded" #after>
      <div mb--1px>
        <div h-8 relative mb--1px translate-x-1px>
          <div border="l b base rounded-lb-2xl" h-5 absolute left-4 w-3 top-0 />
          <div border="r t base rounded-rt-2xl" h-3 absolute left-7 w-3 top-5 translate-y--1px />
        </div>
        <div>
          <template v-for="(item, idx) of items" :key="item.plugin_name">
            <slot name="item" :item="item" :index="idx" />
          </template>
        </div>
        <div h-6 relative mb--2>
          <div border="b r base rounded-br-2xl" h-3 absolute left-7 w-3 top-0 translate-x-1px />
          <div border="t l base rounded-lt-2xl" h-3 absolute left-4 w="[calc(0.75rem+1px)]" top-3 translate-y--1px />
        </div>
      </div>
    </template>
  </FlowmapNode>
</template>
