<script lang="ts" setup>
/* global defineProps */
import MarkdownIt from 'markdown-it'
import * as sub from 'markdown-it-sub'
import * as sup from 'markdown-it-sup'
import { toRefs, ref } from 'vue'
import { useStatusStore } from '@/stores/status'

const status = useStatusStore()

const md = new MarkdownIt({
  html: true,
  typographer: true,
})
  .use(sub)
  .use(sup)

const props = defineProps<{
  content: string
}>()

const { content } = toRefs(props)

const html = md.renderInline(content.value).replaceAll('\n', '<br />')

const size = ref(status.fontSize + 'px')

status.$subscribe(() => {
  size.value = status.fontSize + 'px'
})
</script>

<template>
  <span v-html="html"></span>
</template>

<style scoped>
span {
  font-size: v-bind(size);
}
</style>
