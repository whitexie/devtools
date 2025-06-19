function init() {
  window.__NUXT__ = {}
  window.__NUXT__.config = { public: {}, app: { baseURL: '/', buildAssetsDir: '/_nuxt/', cdnURL: '' } }
  // @ts-expect-error skip type check
  import('./app/devtools-app.js').then((module) => {
    module.mountApp()
  })
}

init()
