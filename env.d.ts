/// <reference types="vite/client" />
declare module 'markdown-it-sub'
declare module 'markdown-it-sup'
declare module 'markdown-it-katex'
declare module 'markdown-it-container'
declare module 'markdown-it-mark'
declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}
