<script setup lang="ts">
import type { RolldownModuleFlowNode } from '../../../node/rpc/functions/rolldown-get-module-info'
import { computed } from 'vue'
import { isFlowmapSwapping } from '../../state/flowmap'

const props = defineProps<{
  item: RolldownModuleFlowNode
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', item: RolldownModuleFlowNode): void
  (e: 'activate', item: RolldownModuleFlowNode): void
}>()

const isDashed = computed(() => {
  switch (props.item.type) {
    case 'transform':
      return props.item.source_from === props.item.source_to
    case 'load':
      return props.item.source == null
    default:
      return false
  }
})

function enter() {
  if (isFlowmapSwapping.value)
    emit('select', props.item)
}

function down() {
  emit('select', props.item)
  isFlowmapSwapping.value = true
}
</script>

<template>
  <div v-if="item.type === 'transform_no_changes' || item.type === 'load_no_changes'" pl10>
    <div
      flex="~ gap-2 items-center" text-sm border="l" py1
      :class="active ? 'border-flow-line-active' : 'border-flow-line'"
    >
      <div
        w-2 h-2 border="4" rounded-full ml--1 translate-x--0.5px
        :class="active ? 'border-flow-line-active' : 'border-flow-line'"
      />
      <span op50>{{ item.count }} plugins did not change the content but cost</span>
      <DisplayDuration :duration="item.duration" :color="true" :factor="5" text-xs />
      <span op50>in total</span>
      <button
        border="~ base rounded-full" px2 py-px op50 hover="op100"
        @click="emit('activate', item)"
      >
        Expand
      </button>
    </div>
  </div>
  <FlowmapNode
    v-else
    :lines="{ top: true }"
    :class-node-outer="isDashed ? 'border-dashed' : ''"
    :active="active"
    class-node-inline="gap-2 items-center"
    pl6
    @pointerenter="enter"
  >
    <template #inner>
      <button
        px3 py1 hover="bg-active" flex="~ inline gap-2 items-center"
        @click="emit('select', item)"
        @pointerdown="down"
      >
        <slot name="button">
          <DisplayPluginName
            v-if="'plugin_name' in item"
            :class="isDashed ? 'op50' : ''"
            :name="item.plugin_name"
            class="font-mono text-sm"
          />
        </slot>
      </button>
    </template>
    <template #inline-after>
      <DisplayDuration :duration="item.duration" :color="true" :factor="5" text-xs />
      <template v-if="item.type === 'transform'">
        <div v-if="item.source_from === item.source_to" text-xs op50>
          no changes
        </div>
        <div v-else>
          <div font-mono text-xs flex="~ gap-1 items-center">
            <span text-green>+{{ item.diff_added }}</span>
            <span text-red>-{{ item.diff_removed }}</span>
          </div>
        </div>
      </template>
    </template>
    <template
      v-if="item.type === 'resolve' && item.resolved_id && item.importer"
      #after
    >
      <div
        p3 ml4 border="l" flex="~ col gap-2"
        :class="active ? 'border-flow-line-active' : 'border-flow-line'"
      >
        <DisplayModuleId :id="item.importer" />
        <div flex="~ gap-1 items-center" pl1>
          <div i-ph-arrow-bend-down-right text-sm op50 />
          <DisplayModuleId :id="item.module_request" />
        </div>
        <div i-ph-arrow-down ml6 text-sm op50 />
        <DisplayModuleId :id="item.resolved_id" ml6 />
      </div>
    </template>
  </FlowmapNode>
</template>
