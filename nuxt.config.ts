// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  imports: {
    dirs: ['store'],
  },
  css: [
    '@/assets/css/astonishingGoose.css',
    '@/assets/css/index.css',
    '@/assets/icon/iconfont.css'
  ],
  routeRules: {
    "/": { ssr: true }, // ssr
    "/exam": {ssr: false},
    "/personInfo": {ssr: false},
    "/exam/*": { ssr: false }, // spa 应用
  },
  modules: [
    'nuxt-monaco-editor',
    'arco-design-nuxt-module',
    '@unocss/nuxt',
    [
      "@pinia/nuxt",
      {
        autoImports: [
          "defineStore",
          "storeToRefs"
        ]
      }
    ]
  ],
  render: {
    crossOrigin: 'anonymous' // 允许跨源请求
  },
  unocss: {
    uno: true, // enabled `@unocss/preset-uno`
    icons: true, // enabled `@unocss/preset-icons`
    attributify: true, // enabled `@unocss/preset-attributify`,
    // core options
    shortcuts: [],
    rules: [],
    safelist: [],
  },
  monacoEditor: {
    // These are default values:
    locale: 'zh-hans',
    componentName: {
      codeEditor: 'CodeEditor',
      diffEditor: 'CodeDiffEditor'
    }
  }
})
