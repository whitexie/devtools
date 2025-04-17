<script setup lang="ts">
import type { RolldownModuleTransformInfo } from '@@/node/rpc/functions/rolldown-get-module-info'
import { useRoute } from '#app/composables/router'
import PluginName from '@/components/display/PluginName.vue'
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { backend } from '../../../state/backend'

const params = useRoute().params as {
  build: string
}
const query = useRoute().query

const selected = ref<RolldownModuleTransformInfo | null>(null)

const { state: info } = useAsyncState(
  async () => {
    return await backend.value!.functions['vite:rolldown:get-module-info']?.({
      build: params.build as string,
      module: query.module as string,
    })
  },
  null,
)

function select(transform: RolldownModuleTransformInfo) {
  selected.value = transform
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

    <FlowmapNode :lines="{ top: true, bottom: true }" pl4 py2>
      <template #content>
        <div i-ph-magnifying-glass-duotone /> Resolve Id
      </template>
    </FlowmapNode>

    <FlowmapNode :lines="{ top: true }" pl4 py2>
      <template #content>
        <div i-ph-upload-simple-duotone /> Load
      </template>
      <template #inline-after>
        <div w-8 relative>
          <div absolute top="1/2" left-0 bottom--4 right="1/2" border="t r base rounded-rt-2xl" z-flowmap-line />
        </div>
        <button>
          <div i-ph-caret-down />
        </button>
      </template>
      <template #after>
        <div pl-12 pt2>
          <template v-for="(load, idx) of info.loads" :key="load.plugin_name">
            <FlowmapNode :lines="{ top: idx > 0, bottom: idx < info.loads.length - 1 }" pl4 py1>
              <template #content>
                <DisplayPluginName :name="load.plugin_name" class="font-mono text-sm" />
              </template>
            </FlowmapNode>
          </template>
        </div>
      </template>
    </FlowmapNode>

    <FlowmapNode :lines="{ top: true }" pl4 py2>
      <template #content>
        <div i-ph-magic-wand-duotone /> Transform
      </template>
      <template #inline-after>
        <div w-8 relative>
          <div absolute top="1/2" left-0 bottom--4 right="1/2" border="t r base rounded-rt-2xl" z-flowmap-line />
        </div>
        <button>
          <div i-ph-caret-down />
        </button>
      </template>
      <template #after>
        <div pl-12 pt2>
          <template v-for="(transform, idx) of info.transforms" :key="transform.plugin_name">
            <FlowmapNode
              :lines="{ top: idx > 0, bottom: idx < info.transforms.length - 1 }"
              class-node-inline="gap-2 items-center"
              :class-node-outer="transform.source_from === transform.source_to ? 'border-dashed' : ''"
              pl4 py1
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

    <FlowmapNode :lines="{ top: true, bottom: true }" pl4 py2>
      <template #content>
        <div i-ph-shapes-duotone /> Chunk
      </template>
    </FlowmapNode>

    <FlowmapNode :lines="{ top: true, bottom: true }" pl4 py2>
      <template #content>
        <div i-ph-tree-duotone /> Tree shake
      </template>
    </FlowmapNode>

    <FlowmapNode :lines="{ top: true }" pl4 py2>
      <template #content>
        <div i-ph-package-duotone /> Generate
      </template>
    </FlowmapNode>

    <div
      v-if="selected"
      absolute right-5 top-5 bottom-5 w-200
      border="~ base rounded-lg" bg-base of-hidden
      grid="~ rows-[max-content_1fr]"
    >
      <div px2 p1 font-mono border="b base">
        <PluginName :name="selected.plugin_name" />
      </div>
      <CodeDiffEditor
        v-if="selected"
        :from="selected.source_from ?? ''"
        :to="selected.source_to ?? ''"
        :diff="true"
        :one-column="true"
      />
    </div>

    <!-- <pre>
      {{ info.state }}
    </pre> -->
  </div>
</template>
