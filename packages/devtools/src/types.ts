export interface DevToolsPluginOptions {
  setup: () => void | Promise<void>
}

// Extend Vite's Plugin interface
declare module 'vite' {
  interface Plugin {
    devtools?: DevToolsPluginOptions
  }
}
