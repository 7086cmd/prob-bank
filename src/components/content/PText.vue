<script lang="ts" setup>
/* global defineProps */
import MarkdownIt from 'markdown-it'
import * as sub from 'markdown-it-sub'
import * as sup from 'markdown-it-sup'
import { toRefs } from 'vue';
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

const html = md.renderInline(content.value)
</script>

<template>
  <span :style="{ fontSize: `${status.fontSize}px` }" v-html="html"></span>
</template>
