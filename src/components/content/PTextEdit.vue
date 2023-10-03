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

function repWithKey(key: string, tag: string, classNames?: string[]) {
  return function (str: string) {
    const list = str.split(key)
    return list
      .map((item, idx) =>
        idx % 2 === 0
          ? item
          : `<${tag}${
              classNames ? ` class="${classNames.join(' ')}"` : ''
            }>${item}</${tag}>`
      )
      .join('')
  }
}

const md = new MarkdownIt({
  html: true,
  breaks: false,
  typographer: true,
}).use(katex)

function compile(str: string) {
  const mark = repWithKey('==', 'mark')
  const sub = repWithKey('~', 'sub')
  const sup = repWithKey('^', 'sup')
  const under = repWithKey('++', 'u')
  const wave = repWithKey('+~+', 'span', ['wave'])
  const empasis = repWithKey('+*+', 'span', ['empasis'])
  const string = mark(sub(sup(under(wave(empasis(str))))))
  return md.renderInline(string.replaceAll('。', science.value ? '。' : '．'))
}

const html = ref(compile(modelValue.value))
const editorVal = ref(modelValue.value)

watch(editorVal, () => {
  html.value = compile(modelValue.value)
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
  font-family: 'Source Han Sans';
  font-size: v-bind(fontSize + 'px');
  word-break: break-all;
}

@media print {
  .normal {
    color: #000000 !important;
    font-family: 'Source Han Serif' !important;
  }
}

.english {
  font-family: 'Times New Roman', 'Source Han Serif' !important;
  font-size: v-bind((fontSize) + 'px');
  word-break: keep-all;
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

.empasis {
  text-emphasis: dot;
  text-emphasis-position: under;
  font-style: normal;
}

.wave {
  text-decoration-style: wavy;
  text-decoration-line: underline;
}

.underline {
  text-decoration-line: underline;
}

.double-underline {
  text-decoration-line: underline;
  text-decoration-style: double;
}
</style>
