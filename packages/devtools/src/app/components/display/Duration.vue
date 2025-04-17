<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    duration: number | undefined
    factor?: number
    color?: boolean
  }>(),
  {
    factor: 1,
    color: true,
  },
)

function getDurationColor(duration: number | undefined) {
  if (!props.color)
    return ''
  if (duration == null)
    return ''
  duration = duration * props.factor
  if (duration < 1)
    return ''
  if (duration > 10000)
    return 'color-scale-critical'
  if (duration > 1000)
    return 'color-scale-high'
  if (duration > 500)
    return 'color-scale-medium'
  if (duration > 200)
    return 'color-scale-low'
  return 'color-scale-neutral'
}

const units = computed(() => {
  if (!props.duration)
    return ['', '-']
  if (props.duration < 1)
    return ['<1', 'ms']
  if (props.duration < 1000)
    return [props.duration.toFixed(0), 'ms']
  if (props.duration < 1000 * 60)
    return [(props.duration / 1000).toFixed(1), 's']
  return [(props.duration / 1000 / 60).toFixed(1), 'min']
})
</script>

<template>
  <DisplayNumberWithUnit :class="getDurationColor(duration)" :number="units[0]" :unit="units[1]" />
</template>
