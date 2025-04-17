import { useLocalStorage } from '@vueuse/core'

export const settings = useLocalStorage(
  'vite-devtools-settings',
  {
    codeviewerLineWrap: false,
    codeviewerDiffPanelSize: 200,
  },
  {
    mergeDefaults: true,
  },
)
