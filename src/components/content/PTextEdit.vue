<script setup lang="ts">
/* global defineProps, defineEmits */

// 即日起，不支持 Textarea

import { watch, toRefs, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { useStatusStore } from '@/stores/status'
import { ElPopover, ElInput } from 'element-plus'

const status = useStatusStore()

const props = defineProps<{
  modelValue: string
  editable: boolean
  prompt?: boolean
}>()

const { modelValue, editable, prompt } = toRefs(props)
const { fontSize } = toRefs(status)

const emits = defineEmits(['update:modelValue'])

const md = new MarkdownIt({
  html: true,
  breaks: false,
  typographer: true,
})

const html = ref(md.renderInline(modelValue.value))
const editorVal = ref(modelValue.value)
const hover = ref(false)

watch(editorVal, () => {
  html.value = md.renderInline(editorVal.value)
  emits('update:modelValue', editorVal.value)
})
</script>

<template>
  <ElPopover trigger="click" v-if="editable">
    <template #reference>
      <span
        :style="`background-color: ${
          hover ? '#e6f7ff' : '#ffffff'
        }; font-size: ${fontSize}px !important`"
        v-if="html !== ''"
        v-html="html"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      />
      <span v-else @mouseover="hover = true" @mouseleave="hover = false">
        点我编辑内容
      </span>
    </template>
    <ElInput v-model="editorVal" />
  </ElPopover>
  <span :style="`font-size: ${fontSize}px !important`" v-else v-html="html" :class="prompt ? 'quote' : ''" />
</template>

<style scoped>
span {
  font-family: 'Source Han Serif' !important;
  font-size: v-bind(fontSize + 'px');
  word-break: break-all;
}

@media print {
  span {
    font-family: 'Times New Roman', 'Source Han Serif' !important;
    color: #000000 !important;
  }
}

.quote {
  font-family: '方正楷体' !important;
  font-size: v-bind((fontSize + 2) + 'px');
}
</style>

<style>
.markdown-body {
  padding-left: 2rem;
}
</style>
