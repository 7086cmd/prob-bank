<script setup lang="ts">
import { watch, toRefs, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { useStatusStore } from '@/stores/status'
import katex from '@/plugins/katex'

const status = useStatusStore()

const props = defineProps<{
  modelValue: string
  prompt?: boolean
  english?: boolean
  italic?: boolean
  title?: boolean
  origin?: boolean
  science?: boolean
}>()

const { modelValue, prompt, english, italic, title, origin, science } =
  toRefs(props)
const { fontSize } = toRefs(status)

const emits = defineEmits(['update:modelValue'])

const md = new MarkdownIt({
  html: true,
  breaks: false,
  typographer: true,
}).use(katex)

const html = ref(
  md.renderInline(
    modelValue.value.replaceAll('。', science.value ? '。' : '．')
  )
)
const editorVal = ref(modelValue.value)

watch(editorVal, () => {
  html.value = md.renderInline(
    editorVal.value.replaceAll('。', science.value ? '。' : '．')
  )
  emits(
    'update:modelValue',
    editorVal.value.replaceAll('。', science.value ? '。' : '．')
  )
})
</script>

<template>
  <span
    :style="{
      fontStyle: italic ? 'italic' : '',
      textAlign: italic ? 'center' : 'left',
    }"
  >
    <span v-if="english" class="english" v-html="html" />
    <span v-else-if="prompt" class="quote" v-html="html" />
    <span v-else-if="title" class="title" v-html="html" />
    <span v-else-if="origin" class="origin" v-html="html" />
    <span v-else class="normal" v-html="html" />
  </span>
</template>

<style scoped>
.normal {
  font-family: 'Source Han Serif' !important;
  font-size: v-bind(fontSize + 'px');
  word-break: break-all;
}

.english {
  font-family: 'Times New Roman', 'Source Han Serif' !important;
  font-size: v-bind((fontSize) + 'px');
  word-break: keep-all;
}

@media print {
  span {
    color: #000000 !important;
  }
}

.quote {
  font-family: '方正楷体' !important;
  font-size: v-bind((fontSize) + 'px');
  word-break: break-all;
}

.origin {
  font-family: '方正仿宋' !important;
  font-size: v-bind((fontSize) + 'px');
  word-break: break-all;
}

.title {
  font-family: 'Source Han Sans' !important;
  font-size: v-bind(fontSize + 'px');
  word-break: break-all;
}
</style>

<style>
.markdown-body {
  padding-left: 2rem;
}
.katex {
  font-size: v-bind((fontSize) + 'px') !important;
  color: #000000 !important;
  /* font-family: 'Latin Morden Math', 'Source Han Serif' !important; */
  margin-bottom: 0 !important;
}

.mtight {
  font-size: v-bind((fontSize - 1) + 'px') !important;
  zoom: 96% !important;
}

table {
  font-size: v-bind((fontSize - 1) + 'px') !important;
}

table .mtight {
  font-size: v-bind((fontSize - 2) + 'px') !important;
  zoom: 84% !important;
}

@media print {
  .mtight {
    zoom: 92% !important;
  }
  .formula {
    color: #000000 !important;
  }
}

.frac-line {
  color: #000000 !important;
  /* display: none !important; */
  border: none !important;
  box-sizing: border-box !important;
  border-color: #000000 !important;
  max-height: 2px;
  /* border-bottom-width: 0.02em !important; */
}

.frac-line::before,
.frac-line::after {
  box-sizing: border-box !important;
  border-color: #000000 !important;
  /* border-bottom-width: 0.02em !important; */
}
</style>
