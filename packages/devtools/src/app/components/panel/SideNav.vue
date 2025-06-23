<script setup lang="ts">
import { NuxtLink } from '#components'
import { ref } from 'vue'

interface SideNavItem {
  icon: string
  title: string
  to?: string
  action?: () => void
}

const items = ref<SideNavItem[]>([
  {
    title: 'Home',
    icon: 'i-ph-house-duotone',
    to: '/',
  },
  {
    title: 'Toggle dark mode',
    icon: 'i-ph-sun-duotone dark:i-ph-moon-duotone',
    action: toggleDark,
  },
])
</script>

<template>
  <div border="r base" flex="~ col gap-2" p1 of-y-scroll bg-base relative>
    <template v-for="item in items" :key="item.title">
      <component
        :is="item.to ? NuxtLink : 'button'"
        v-bind="item.to ? { to: item.to } : {}"
        v-tooltip="item.title"
        :title="item.title"
        rounded-full
        p2 hover:bg-active op-fade hover:op100
        flex="~ items-center justify-center"
        @click="item.action?.()"
      >
        <div :class="item.icon" text-lg />
      </component>
    </template>
  </div>
</template>
