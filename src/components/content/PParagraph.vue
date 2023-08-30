<script setup lang="ts">
import { toRefs, ref, watch, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import katex from '@/plugins/katex'
import { ElButton, ElInput } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: string
  mode: 'line' | 'area'
}>()

const emits = defineEmits(['update:modelValue'])

const { modelValue, mode } = toRefs(props)

if (!mode?.value) {
  mode.value = 'line'
}

const edit = ref(true)
const input = ref()

function transformer(text: string, key: string, value: string) {
  let hash = Math.random().toString(36)
  while (text.includes(hash)) {
    hash = Math.random().toString(36)
  }
  return text
    .replaceAll(`\\${key}`, hash)
    .split(key)
    .reduce((prev, cur, idx) => {
      if (idx % 2 === 0) {
        prev += cur
      } else {
        prev += `<${value}>${cur}</${value}>`
      }
      return prev
    })
    .replaceAll(hash, `\\${key}`)
}

function transformAll(txt: string) {
  return transformer(
    transformer(transformer(txt, '^', 'sup'), '~', 'sub'),
    '==',
    'mark'
  )
}

function compile(txt: string) {
  const text = transformAll(txt)
  return mode.value === 'line' ? md.renderInline(txt) : `<div class="markdown-body vp-doc">${md.render(text)}</div>`
}

const inputed = ref(modelValue.value)

const md = new MarkdownIt({
  html: true,
  breaks: false,
  typographer: true,
}).use(katex)

const html = ref(compile(inputed.value))

watch(inputed, () => {
  html.value = compile(inputed.value)
  emits('update:modelValue', inputed.value)
})

function save() {
  edit.value = false
}

function editIt() {
  edit.value = true
  onMounted(() => {
    input.value.focus()
  })
}

const fontSize = ref(14)
</script>

<template>
  <ElInput
    ref="input"
    v-if="edit"
    type="textarea"
    v-model="inputed"
    :autosize="mode === 'area'"
    @keydown.enter="mode === 'line' ? save() : undefined"
  />
  <p v-else v-html="html" @click="editIt" />
  <div v-if="mode === 'area' && edit" style="text-align: right" class="py-1">
    <ElButton :icon="ArrowRight" text bg circle type="success" @click="save" />
  </div>
</template>

<style scoped>
p {
  font-family: 'Source Han Serif' !important;
  font-size: v-bind(fontSize + 'px');
  word-break: break-all;
  padding: 0.8rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

@media print {
  p {
    font-family: 'Times New Roman', 'Source Han Serif' !important;
    color: #000000 !important;
  }
}

.quote {
  font-family: '方正楷体' !important;
  font-size: v-bind((fontSize + 2) + 'px');
}

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
