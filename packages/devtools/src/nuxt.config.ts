import process from 'node:process'
import Inspect from 'vite-plugin-inspect'

const NUXT_DEBUG_BUILD = !!process.env.NUXT_DEBUG_BUILD
const backend = process.env.NMI_BACKEND ?? 'dev'
const isWebContainer = backend === 'webcontainer'

const headers = isWebContainer
  ? {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  : {}

export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/eslint',
    'nuxt-eslint-auto-explicit-import',
    ...isWebContainer ? ['./app/modules/webcontainer'] : [],
  ],

  logLevel: 'verbose',
  srcDir: 'app',

  eslint: {
    config: {
      standalone: false,
    },
  },

  experimental: {
    typedPages: true,
    clientNodeCompat: true,
  },

  features: {
    inlineStyles: false,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  nitro: {
    minify: NUXT_DEBUG_BUILD ? false : undefined,
    preset: 'static',
    output: {
      dir: '../dist',
    },
    routeRules: {
      '/': {
        prerender: true,
      },
      '/200.html': {
        prerender: true,
      },
      '/404.html': {
        prerender: true,
      },
      '/**': {
        prerender: false,
        headers,
      },
    },
    sourceMap: false,
  },

  app: {
    baseURL: './',
    head: {
      title: 'Vite DevTools',
      charset: 'utf-8',
      viewport: 'width=device-width,initial-scale=1',
      meta: [
        { name: 'description', content: 'DevTools for Vite' },
        { property: 'og:title', content: 'Vite DevTools' },
        { property: 'og:description', content: 'DevTools for Vite' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `/favicon.svg` },
      ],
      htmlAttrs: {
        lang: 'en',
        class: 'bg-dots',
      },
    },
  },

  vite: {
    base: './',
    define: {
      'import.meta.env.BACKEND': JSON.stringify(backend),
    },
    server: {
      headers,
    },
    build: {
      rollupOptions: {
        debug: {},
      },
      minify: NUXT_DEBUG_BUILD ? false : undefined,
    },
    optimizeDeps: {
      include: [
        'fuse.js',
        'd3-hierarchy',
        'd3-shape',
        'modern-screenshot',
      ],
      exclude: [
        'structured-clone-es',
        'birpc',
      ],
    },
    plugins: [
      NUXT_DEBUG_BUILD ? Inspect({ build: true }) : null,
    ],
  },

  devtools: {
    enabled: false,
  },

  typescript: {
    includeWorkspace: true,
  },

  hooks: {
    'prepare:types': function ({ tsConfig }) {
      const aliasesToRemoveFromAutocomplete = ['~~', '~~/*', '~', '~/*']
      for (const alias of aliasesToRemoveFromAutocomplete) {
        if (tsConfig.compilerOptions?.paths[alias]) {
          delete tsConfig.compilerOptions.paths[alias]
        }
      }
    },
  },

  compatibilityDate: '2024-07-17',
})
