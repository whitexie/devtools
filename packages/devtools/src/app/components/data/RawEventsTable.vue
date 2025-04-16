<script setup lang="ts">
import type { RolldownEvent } from '../../../node/rolldown/events-manager'
import { Dropdown as VDropdown } from 'floating-vue'
import { defineProps, withDefaults } from 'vue'

type FIELDS = 'module_id' | 'kind' | 'source' | 'timestamp' | 'plugin_name'

const props = withDefaults(
  defineProps<{
    events: RolldownEvent[]
    fields?: FIELDS[]
  }>(),
  {
    fields: () => [
      'kind',
      'module_id',
      'plugin_name',
      'timestamp',
      'source',
    ],
  },
)

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
            <DisplayModuleId v-if="field === 'module_id'" :id="event.module_id" />
            <DisplayBadge v-else-if="field === 'kind'" :text="event.kind" />
            <DisplayPluginName v-else-if="field === 'plugin_name'" font-mono :name="event.plugin_name" />
            <VDropdown v-else-if="field === 'source' && getSource(event)">
              <div i-ph-code />
              <template #popper>
                <pre p1 text-sm v-text="getSource(event)" />
              </template>
            </VDropdown>
            <DisplayTimestamp v-else-if="field === 'timestamp'" text-sm :timestamp="event.timestamp" />
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
