<script setup lang="ts">
import type { RolldownModuleLoadInfo, RolldownModuleTransformInfo, RolldownResolveInfo } from '../../../../node/rpc/functions/rolldown-get-module-info'
import { useRoute } from '#app/composables/router'
import PluginName from '@/components/display/PluginName.vue'
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { backend } from '../../../state/backend'

const params = useRoute().params as {
  build: string
}
const query = useRoute().query

const selected = ref<{
  type: 'load' | 'transform'
  plugin_name: string
  from: string | null
  to: string | null
} | null>()

const { state: info } = useAsyncState(
  async () => {
    return await backend.value!.functions['vite:rolldown:get-module-info']?.({
      build: params.build as string,
      module: query.module as string,
    })
  },
  null,
)

function select(transform: RolldownModuleTransformInfo | RolldownModuleLoadInfo | RolldownResolveInfo) {
  if ('source_from' in transform) {
    selected.value = {
      type: 'transform',
      plugin_name: transform.plugin_name,
      from: transform.source_from,
      to: transform.source_to,
    }
  }
  else if ('source' in transform) {
    selected.value = {
      type: 'load',
      plugin_name: transform.plugin_name,
      from: transform.source,
      to: transform.source,
    }
  }
  else {
    selected.value = null
  }
}
</script>

<template>
  <div v-if="info" p4>
    <FlowmapNode :lines="{ bottom: true }" py2>
      <template #content>
        <div p2>
          <DisplayModuleId :id="(query.module as string)" />
        </div>
      </template>
    </FlowmapNode>

    <FlowmapNode :lines="{ top: true, bottom: true }" pl6 py2>
      <template #content>
        <div i-ph-magnifying-glass-duotone /> Resolve Id
      </template>
    </FlowmapNode>

    <FlowmapNode
      :lines="{ top: true, bottom: info.resolve_ids.length === 0 }" pl6 py2
      :class-node-outer="info.resolve_ids.length === 0 ? 'border-dashed' : ''"
    >
      <template #content>
        <div i-ph-magnifying-glass-duotone /> Resolve Id
        <span op50 text-xs>({{ info.resolve_ids.length }})</span>
      </template>
      <template v-if="info.resolve_ids.length > 0" #inline-before>
        <button w-6 h-6 mr1 ml--7 mya rounded-full hover="bg-active" flex="~ items-center justify-center">
          <div i-ph-caret-down text-sm op50 />
        </button>
      </template>
      <template v-if="info.resolve_ids.length > 0" #inline-after>
        <div w-8 relative>
          <div absolute top="1/2" left-0 bottom--4 right="1/2" border="t r base rounded-rt-2xl" z-flowmap-line />
        </div>
      </template>
      <template #after>
        <div pl-12 pt2>
          <template v-for="(resolve_id, idx) of info.resolve_ids" :key="resolve_id.plugin_name">
            <FlowmapNode
              :lines="{ top: idx > 0, bottom: idx < info.resolve_ids.length - 1 }"
              class-node-inline="gap-2 items-center"
              pl6 py1
            >
              <template #inner>
                <button
                  px3 py1 hover="bg-active" flex="~ inline gap-2 items-center"
                  @click="select(resolve_id)"
                >
                  <DisplayPluginName :name="resolve_id.plugin_name" class="font-mono text-sm" />
                </button>
              </template>
              <template #inline-after>
                <DisplayDuration :duration="resolve_id.duration" :color="true" :factor="5" text-xs />
                <!-- <div v-if="resolve_id.source_from === resolve_id.source_to" text-xs op50>
                  no changes
                </div> -->
              </template>
            </FlowmapNode>
          </template>
        </div>
      </template>
    </FlowmapNode>

    <FlowmapNode
      :lines="{ top: true, bottom: info.loads.length === 0 }" pl6 py2
      :class-node-outer="info.loads.length === 0 ? 'border-dashed' : ''"
    >
      <template #content>
        <div i-ph-upload-simple-duotone /> Load
        <span op50 text-xs>({{ info.loads.length }})</span>
      </template>
      <template v-if="info.loads.length > 0" #inline-before>
        <button w-6 h-6 mr1 ml--7 mya rounded-full hover="bg-active" flex="~ items-center justify-center">
          <div i-ph-caret-down text-sm op50 />
        </button>
      </template>
      <template v-if="info.loads.length > 0" #inline-after>
        <div w-8 relative>
          <div absolute top="1/2" left-0 bottom--4 right="1/2" border="t r base rounded-rt-2xl" z-flowmap-line />
        </div>
      </template>
      <template v-if="info.loads.length > 0" #after>
        <div pl-12 pt2>
          <template v-for="(load, idx) of info.loads" :key="load.plugin_name">
            <FlowmapNode :lines="{ top: idx > 0, bottom: idx < info.loads.length - 1 }" pl6 py1>
              <template #inner>
                <button
                  :class="load.source ? '' : 'op75'"
                  px3 py1 hover="bg-active" flex="~ inline gap-2 items-center"
                  @click="select(load)"
                >
                  <DisplayPluginName :name="load.plugin_name" class="font-mono text-sm" />
                </button>
              </template>
            </FlowmapNode>
          </template>
        </div>
      </template>
    </FlowmapNode>

    <FlowmapNode
      :lines="{ top: true, bottom: info.transforms.length === 0 }" pl6 py2
      :class-node-outer="info.transforms.length === 0 ? 'border-dashed' : ''"
    >
      <template #content>
        <div i-ph-magic-wand-duotone /> Transform
        <span op50 text-xs>({{ info.transforms.length }})</span>
      </template>
      <template v-if="info.transforms.length > 0" #inline-before>
        <button w-6 h-6 mr1 ml--7 mya rounded-full hover="bg-active" flex="~ items-center justify-center">
          <div i-ph-caret-down text-sm op50 />
        </button>
      </template>
      <template v-if="info.transforms.length > 0" #inline-after>
        <div w-8 relative>
          <div absolute top="1/2" left-0 bottom--4 right="1/2" border="t r base rounded-rt-2xl" z-flowmap-line />
        </div>
      </template>
      <template #after>
        <div pl-12 pt2>
          <template v-for="(transform, idx) of info.transforms" :key="transform.plugin_name">
            <FlowmapNode
              :lines="{ top: idx > 0, bottom: idx < info.transforms.length - 1 }"
              class-node-inline="gap-2 items-center"
              :class-node-outer="transform.source_from === transform.source_to ? 'border-dashed' : ''"
              pl6 py1
            >
              <template #inner>
                <button
                  :class="transform.source_from === transform.source_to ? 'op75' : ''"
                  px3 py1 hover="bg-active" flex="~ inline gap-2 items-center"
                  @click="select(transform)"
                >
                  <DisplayPluginName :name="transform.plugin_name" class="font-mono text-sm" />
                </button>
              </template>
              <template #inline-after>
                <DisplayDuration :duration="transform.duration" :color="true" :factor="5" text-xs />
                <div v-if="transform.source_from === transform.source_to" text-xs op50>
                  no changes
                </div>
              </template>
            </FlowmapNode>
          </template>
        </div>
      </template>
    </FlowmapNode>

    <FlowmapNode :lines="{ top: true, bottom: true }" pl6 py2>
      <template #content>
        <div i-ph-shapes-duotone /> Chunk
      </template>
    </FlowmapNode>

    <FlowmapNode :lines="{ top: true, bottom: true }" pl6 py2>
      <template #content>
        <div i-ph-tree-duotone /> Tree shake
      </template>
    </FlowmapNode>

    <FlowmapNode :lines="{ top: true }" pl6 py2>
      <template #content>
        <div i-ph-package-duotone /> Generate
      </template>
    </FlowmapNode>

    <div
      v-if="selected"
      absolute right-5 top-5 bottom-5 w-200
      border="~ base rounded-lg" bg-glass of-hidden
      grid="~ rows-[max-content_1fr]"
    >
      <div px2 p1 font-mono border="b base" flex="~ items-center gap-2">
        <PluginName :name="selected.plugin_name" />
        <span text-xs op50>
          {{ selected.type === 'load' ? 'Load' : 'Transform' }}
        </span>
      </div>
      <CodeDiffEditor
        v-if="selected"
        :from="selected.from ?? ''"
        :to="selected.to ?? ''"
        :diff="true"
        :one-column="true"
      />
    </div>

    <!-- <pre>
      {{ info.state }}
    </pre> -->
  </div>
</template>
