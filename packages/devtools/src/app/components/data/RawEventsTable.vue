<script setup lang="ts">
import type { RolldownEvent } from '../../../node/rolldown/events-manager'
import { Dropdown as VDropdown } from 'floating-vue'
import { defineProps, withDefaults } from 'vue'

type FIELDS = 'module_id' | 'kind' | 'source' | 'timestamp' | 'event_id' | 'plugin_name' | '*'

const props = withDefaults(
  defineProps<{
    events: RolldownEvent[]
    fields?: FIELDS[]
  }>(),
  {
    fields: () => [
      'event_id',
      'kind',
      'module_id',
      'plugin_name',
      'timestamp',
      'source',
      '*',
    ],
  },
)

function omit(obj: RolldownEvent, inputs: string[]) {
  const fields = new Set(inputs)
  if (fields.has('source')) {
    fields.add('source')
    fields.add('transformed_source')
  }
  if (fields.has('plugin_name')) {
    fields.add('plugin_index')
  }
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !fields.has(key)),
  )
}

function getSource(event: RolldownEvent) {
  if (event.kind === 'HookLoadCallEnd') {
    return event.source
  }
  if (event.kind === 'HookTransformCallStart') {
    return event.source
  }
  if (event.kind === 'HookTransformCallEnd') {
    return event.transformed_source
  }
  return null
}
</script>

<template>
  <table>
    <tbody>
      <tr v-for="event of props.events" :key="event.event_id">
        <template v-for="field of props.fields" :key="field">
          <td px2>
            <DisplayModuleId v-if="field === 'module_id'" :id="'module_id' in event ? event.module_id : ''" />
            <DisplayBadge v-else-if="field === 'kind'" :text="event.kind" />
            <div v-else-if="field === 'plugin_name' && 'plugin_name' in event">
              <DisplayPluginName font-mono :name="event.plugin_name" />
              <code op50>#{{ event.plugin_index }}</code>
            </div>
            <div v-else-if="field === 'event_id'">
              {{ event.event_id }}
            </div>
            <VDropdown v-else-if="field === 'source' && getSource(event)">
              <div i-ph-code />
              <template #popper>
                <pre p1 text-sm v-text="getSource(event)" />
              </template>
            </VDropdown>
            <DisplayTimestamp v-else-if="field === 'timestamp'" text-sm :timestamp="event.timestamp" />
            <pre v-else-if="field === '*'" text-sm v-text="omit(event, fields)" />
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
