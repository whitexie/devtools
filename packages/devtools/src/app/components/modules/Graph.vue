<script setup lang="ts">
import type { HierarchyLink, HierarchyNode } from 'd3-hierarchy'
import type { ModuleListItem, SessionContext } from '../../types/data'
import { hierarchy, tree } from 'd3-hierarchy'
import { linkHorizontal, linkVertical } from 'd3-shape'
import { computed, nextTick, onMounted, reactive, ref, shallowReactive, shallowRef, useTemplateRef, watch } from 'vue'

const props = defineProps<{
  session: SessionContext
  modules: ModuleListItem[]
}>()

type Link = HierarchyLink<ModuleListItem> & {
  id: string
}

const graphRender = ref<'normal' | 'mini'>('normal')

const SPACING = reactive({
  width: computed(() => graphRender.value === 'normal' ? 400 : 10),
  height: computed(() => graphRender.value === 'normal' ? 55 : 20),
  linkOffset: computed(() => graphRender.value === 'normal' ? 20 : 0),
  margin: computed(() => 800),
  gap: computed(() => graphRender.value === 'normal' ? 150 : 100),
})

const container = useTemplateRef<HTMLDivElement>('container')
const isGrabbing = ref(false)
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
const scale = ref(1)
const nodesRefMap = shallowReactive(new Map<string, HTMLDivElement>())

const nodes = shallowRef<HierarchyNode<ModuleListItem>[]>([])
const links = shallowRef<Link[]>([])
const nodesMap = shallowReactive(new Map<string, HierarchyNode<ModuleListItem>>())
const linksMap = shallowReactive(new Map<string, Link>())

const modulesMap = computed(() => {
  const map = new Map<string, ModuleListItem>()
  for (const module of props.modules) {
    map.set(module.id, module)
  }
  return map
})

const rootModules = computed(() => {
  return props.modules.filter(x => x.importers.length === 0)
})

const createLinkHorizontal = linkHorizontal()
  .x(d => d[0])
  .y(d => d[1])

const createLinkVertical = linkVertical()
  .x(d => d[0])
  .y(d => d[1])

function calculateGraph() {
  // Unset the canvas size, and recalculate again after nodes are rendered
  width.value = window.innerWidth
  height.value = window.innerHeight

  const seen = new Set<ModuleListItem>()
  const root = hierarchy<ModuleListItem>(
    { id: '~root' } as any,
    (node) => {
      if (node.id === '~root') {
        rootModules.value.forEach(x => seen.add(x))
        return rootModules.value
      }
      const modules = node.imports.map((x) => {
        const module = modulesMap.value.get(x.id)
        if (module) {
          if (seen.has(module)) {
            return undefined
          }
          seen.add(module)
        }
        return module
      }).filter(x => x !== undefined)
      return modules
    },
  )

  // Calculate the layout
  const layout = tree<ModuleListItem>()
    .nodeSize([SPACING.height, SPACING.width + SPACING.gap])
  layout(root)

  // Rotate the graph from top-down to left-right
  const _nodes = root.descendants()
  for (const node of _nodes) {
    [node.x, node.y] = [node.y! - SPACING.width, node.x!]
  }

  // Offset the graph and adding margin
  const minX = Math.min(..._nodes.map(n => n.x!))
  const minY = Math.min(..._nodes.map(n => n.y!))
  if (minX < SPACING.margin) {
    for (const node of _nodes) {
      node.x! += Math.abs(minX) + SPACING.margin
    }
  }
  if (minY < SPACING.margin) {
    for (const node of _nodes) {
      node.y! += Math.abs(minY) + SPACING.margin
    }
  }

  nodes.value = _nodes
  nodesMap.clear()
  for (const node of _nodes) {
    nodesMap.set(node.data.id, node)
  }
  const _links = root.links()
    .filter(x => x.source.data.id !== '~root')
    .map((x) => {
      return {
        ...x,
        id: `${x.source.data.id}|${x.target.data.id}`,
      }
    })
  linksMap.clear()
  for (const link of _links) {
    linksMap.set(link.id, link)
  }
  links.value = _links

  nextTick(() => {
    width.value = (container.value!.scrollWidth / scale.value + SPACING.margin)
    height.value = (container.value!.scrollHeight / scale.value + SPACING.margin)
    focusOn(rootModules.value[0].id, false)
  })
}

function focusOn(id: string, animated = true) {
  const el = nodesRefMap.get(id)
  el?.scrollIntoView({
    block: 'center',
    inline: 'center',
    behavior: animated ? 'smooth' : 'instant',
  })
}

function generateLink(link: Link) {
  if (link.target.x! <= link.source.x!) {
    return createLinkVertical({
      source: [link.source.x! + SPACING.width / 2 - SPACING.linkOffset, link.source.y!],
      target: [link.target.x! - SPACING.width / 2 + SPACING.linkOffset, link.target.y!],
    })
  }
  return createLinkHorizontal({
    source: [link.source.x! + SPACING.width / 2 - SPACING.linkOffset, link.source.y!],
    target: [link.target.x! - SPACING.width / 2 + SPACING.linkOffset, link.target.y!],
  })
}

function getLinkColor(_link: Link) {
  return 'stroke-#8882'
}

onMounted(() => {
  watch(
    () => [props.modules, graphRender.value],
    calculateGraph,
    { immediate: true },
  )
})
</script>

<template>
  <div
    ref="container"
    w-screen h-screen of-scroll relative select-none
    :class="isGrabbing ? 'cursor-grabbing' : ''"
  >
    <svg pointer-events-none absolute left-0 top-0 z-graph-link :width="width" :height="height">
      <g>
        <path
          v-for="link of links"
          :key="link.id"
          :d="generateLink(link)!"
          :class="getLinkColor(link)"
          fill="none"
        />
      </g>
    </svg>
    <!-- <svg pointer-events-none absolute left-0 top-0 z-graph-link-active :width="width" :height="height">
      <g>
        <path
          v-for="link of links"
          :key="link.id"
          :d="generateLink(link)!"
          fill="none"
          class="stroke-primary:75"
        />
      </g>
    </svg> -->
    <template
      v-for="node of nodes"
      :key="node.data.id"
    >
      <template v-if="node.data.id !== '~root'">
        <DisplayModuleId
          :id="node.data.id"
          :ref="(el: any) => nodesRefMap.set(node.data.id, el?.$el)"
          absolute hover="bg-active" block px2 p1 bg-glass z-graph-node
          border="~ base rounded"
          :link="true"
          :session="session"
          :pkg="node.data"
          :minimal="true"
          :style="{
            left: `${node.x}px`,
            top: `${node.y}px`,
            minWidth: graphRender === 'normal' ? `${SPACING.width}px` : undefined,
            transform: 'translate(-50%, -50%)',
            maxWidth: '400px',
            maxHeight: '50px',
            overflow: 'hidden',
          }"
        />
      </template>
    </template>
  </div>
</template>
