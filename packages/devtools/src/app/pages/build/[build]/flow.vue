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
      session: params.build as string,
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

    <FlowmapExpandable :items="info.resolve_ids">
      <template #node>
        <div i-ph-magnifying-glass-duotone /> Resolve Id
      </template>
      <template #item="{ item, index }">
        <FlowmapNode
          :lines="{ top: index > 0, bottom: index < info.resolve_ids.length - 1 }"
          class-node-inline="gap-2 items-center"
          pl6 py1
        >
          <template #inner>
            <button
              px3 py1 hover="bg-active" flex="~ inline gap-2 items-center"
              @click="select(item)"
            >
              <DisplayPluginName :name="item.plugin_name" class="font-mono text-sm" />
            </button>
          </template>
          <template #inline-after>
            <DisplayDuration :duration="item.duration" :color="true" :factor="5" text-xs />
          </template>
        </FlowmapNode>
      </template>
    </FlowmapExpandable>

    <FlowmapExpandable :items="info.loads">
      <template #node>
        <div i-ph-upload-simple-duotone /> Load
      </template>
      <template #item="{ item }">
        <FlowmapNode
          :lines="{ top: true, bottom: true }"
          class-node-inline="gap-2 items-center"
          pl6 py1
        >
          <template #inner>
            <button
              :class="item.source ? '' : 'op75'"
              px3 py1 hover="bg-active" flex="~ inline gap-2 items-center"
              @click="select(item)"
            >
              <DisplayPluginName :name="item.plugin_name" class="font-mono text-sm" />
            </button>
          </template>
          <template #inline-after>
            <DisplayDuration :duration="item.duration" :color="true" :factor="5" text-xs />
            <div v-if="item.source === null" text-xs op50>
              no source
            </div>
          </template>
        </FlowmapNode>
      </template>
    </FlowmapExpandable>

    <FlowmapExpandable :items="info.transforms">
      <template #node>
        <div i-ph-magic-wand-duotone /> Transform
      </template>
      <template #item="{ item }">
        <FlowmapNode
          :lines="{ top: true, bottom: true }"
          class-node-inline="gap-2 items-center"
          :class-node-outer="item.source_from === item.source_to ? 'border-dashed' : ''"
          pl6 py1
        >
          <template #inner>
            <button
              :class="item.source_from === item.source_to ? 'op75' : ''"
              px3 py1 hover="bg-active" flex="~ inline gap-2 items-center"
              @click="select(item)"
            >
              <DisplayPluginName :name="item.plugin_name" class="font-mono text-sm" />
            </button>
          </template>
          <template #inline-after>
            <DisplayDuration :duration="item.duration" :color="true" :factor="5" text-xs />
            <div v-if="item.source_from === item.source_to" text-xs op50>
              no changes
            </div>
          </template>
        </FlowmapNode>
      </template>
    </FlowmapExpandable>

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
      absolute right-3 top-3 bottom-3 w-100
      border="~ base rounded-lg" bg-glass of-hidden
      grid="~ rows-[max-content_1fr]"
    >
      <div px4 p2 font-mono border="b base" flex="~ items-center gap-2">
        <PluginName :name="selected.plugin_name" />
        <span op50 text-xs>
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
