import { defineComponent, h } from 'vue'
import { getPluginColor } from '../../utils/color'

export default defineComponent({
  name: 'HighlightedPath',
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const parts = props.path.split(/([/?&:=])/g)
      let type: 'start' | 'path' | 'query' = 'start'

      const classes: string[][] = parts.map(() => [])
      const styles: string[][] = parts.map(() => [])
      const nodes = parts.map((part) => {
        return h('span', { class: '' }, part)
      })

      const removeIndexes = new Set<number>()

      parts.forEach((part, index) => {
        if (part === '?')
          type = 'query'

        if (type === 'start') {
          if (part.match(/^\.+$/)) {
            classes[index].push('op50')
          }
          else if (part === '/') {
            classes[index].push('op50')
          }
          else if (part !== '/') {
            type = 'path'
          }
        }

        if (type === 'path') {
          if (part === '/') {
            classes[index].push('op50')
          }
          else if (part === 'node_modules' || part === 'dist' || part === 'lib' || part.match(/^\.\w/)) {
            classes[index].push('op60')
          }

          if (part === '.pnpm') {
            classes[index]?.push('op50')
            if (nodes[index])
              nodes[index].children = '…'
            removeIndexes.add(index + 1)
            removeIndexes.add(index + 2)
            if (nodes[index + 4]?.children === 'node_modules') {
              removeIndexes.add(index + 3)
              removeIndexes.add(index + 4)
            }
          }
          if (part === ':') {
            if (nodes[index - 1]) {
              styles[index - 1].push(`color: ${getPluginColor(parts[index - 1])}`)
            }
            classes[index].push('op50')
          }
          if (parts[index - 2] === 'node_modules' && !part.startsWith('.')) {
            const color = `color: ${getPluginColor(parts[index])}`
            styles[index].push(color)
            if (part.startsWith('@')) {
              styles[index + 1].push(color)
              styles[index + 2].push(color)
            }
          }
        }

        if (type === 'query') {
          if (part === '?') {
            classes[index].push('text-red-5 dark:text-red-4')
          }
          else if (part === '&') {
            classes[index].push('text-orange-5 dark:text-orange-4')
          }
          if (part === '=') {
            classes[index].push('text-orange-9 dark:text-orange-2 op50')
          }
          else if (parts[index + 1] === '=') {
            classes[index].push('text-amber-9 dark:text-amber-2')
          }
          else {
            classes[index].push('text-orange-9 dark:text-orange-2')
          }
        }
      })

      nodes.forEach((node, index) => {
        if (node.props) {
          node.props.class = classes[index].join(' ')
          node.props.style = styles[index].join(';')
        }
      })

      Array.from(removeIndexes)
        .sort((a, b) => b - a)
        .forEach((index) => {
          nodes.splice(index, 1)
        })

      return nodes
    }
  },
})
