import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoImport from 'unplugin-auto-import/vite'
import vueComponents from 'unplugin-vue-components/vite'
import vueMarkdown from 'vite-plugin-vue-markdown'
import prismjs from 'vite-plugin-prismjs'
import vueDevtools from 'vite-plugin-vue-devtools'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    vueComponents({
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    autoImport({
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    icons(),
    vueMarkdown({
      markdownItSetup(md) {
        md.use(require('markdown-it-sub'))
        md.use(require('markdown-it-sup'))
        md.use(require('markdown-it-mathjax3'))
      },
      wrapperClasses: "markdown-body vp-doc",
    }),
    prismjs(),
    vueDevtools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
})
