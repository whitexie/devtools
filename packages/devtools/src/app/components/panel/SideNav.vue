<script setup lang="ts">
import type { SideNavItem } from '~/state/nav'
import { NuxtLink } from '#components'
import { computed } from 'vue'
import { sideNavItems } from '~/state/nav'

const items = computed<SideNavItem[]>(() => [
  ...sideNavItems.value,
  {
    title: 'Toggle dark mode',
    icon: 'i-ph-sun-duotone dark:i-ph-moon-duotone',
    action: toggleDark,
  },
])
</script>

<template>
  <div border="r base" flex="~ col gap-1" p1 of-y-scroll bg-base relative>
    <template v-for="item in items" :key="item.title">
      <component
        :is="item.to ? NuxtLink : 'button'"
        v-bind="item.to ? { to: item.to } : {}"
        v-tooltip="item.title"
        :title="item.title"
        rounded-full
        p2 hover:bg-active op-fade hover:op100
        flex="~ items-center justify-center"
        exact-active-class="text-primary op100!"
        @click="item.action?.()"
      >
        <div :class="item.icon" text-lg />
      </component>
    </template>
  </div>
</template>
