<script lang="ts" setup>
/* global defineProps */
import MarkdownIt from 'markdown-it'
import katex from '@/plugins/katex'
import { toRefs, ref } from 'vue'
import { useStatusStore } from '@/stores/status'
import type { TextareaContent } from '@/../@types/content'
import 'katex/contrib/mhchem/mhchem.js'

const status = useStatusStore()

const md = new MarkdownIt({
  html: true,
  typographer: true,
}).use(katex, {
  throwOnError: false,
  errorColor: '#cc0000',
})

const props = defineProps<{
  content: string
  mode: 'area' | 'span'
  attrib?: TextareaContent['attrib']
}>()

function handler(key: string, tag: string, result: string) {
  const results = result.split(tag)
  let res = ''
  results.forEach((x, i) => {
    if (i % 2 === 0) {
      res += x
    } else {
      res += `<${key}>${x}</${key}>`
    }
  })
  return res
}

const { content, mode, attrib } = toRefs(props)

const html =
  mode.value === 'span'
    ? md.renderInline(content.value)
    : `<div class="markdown-body vp-doc">${handler(
        '==',
        'mark',
        handler('^', 'sup', handler('~', 'sub', md.render(content.value)))
      )}</div>`

const { fontSize } = toRefs(status)

const fontFamily = ref('Source Han Serif SC')

switch (attrib?.value) {
  case 'normal':
    fontFamily.value = 'Source Han Serif SC'
    break
  case 'command':
    fontFamily.value = 'Source Han Sans SC'
    break
  case 'origin':
    fontFamily.value = '方正仿宋'
    break
  case 'quote':
    fontFamily.value = '方正楷体'
    break
  default:
    fontFamily.value = 'Source Han Serif SC'
    break
}
</script>

<template>
  <span v-html="html"></span>
</template>

<style scoped>
span {
  font-size: v-bind(fontSize + 'px');
  color: #000000 !important;
  font-family: v-bind(fontFamily) !important;
}

@media print {
  span {
    font-family: v-bind(fontFamily) !important;
  }
}
</style>

<style>
.markdown-body {
  padding-left: 2rem;
}
</style>
