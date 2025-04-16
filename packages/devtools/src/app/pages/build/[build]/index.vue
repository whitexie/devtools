<script setup lang="ts">
import { useRoute } from '#app/composables/router'
import { onMounted, shallowRef } from 'vue'
import { backend } from '../../../state/backend'

const params = useRoute().params

const modules = shallowRef<string[]>([])

onMounted(async () => {
  modules.value = await backend.value!.functions['vite:rolldown:get-module-list']({
    build: params.build,
  })
})
</script>

<template>
  <table>
    <tbody>
      <tr v-for="mod of modules" :key="mod">
        <td>
          <NuxtLink :to="{ path: `/build/${params.build}/transform`, query: { module: mod } }">
            <UiFilepathItem :filepath="mod.id" :subpath="true" />
          </NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>
