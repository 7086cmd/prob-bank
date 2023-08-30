<script setup lang="ts">
import PTextEdit from '@/components/content/PTextEdit.vue'
import PFormulaEdit from '@/components/content/PFormulaEdit.vue'
import { ref } from 'vue'
import PContentEditor from '@/components/content/PContentEditor.vue'
import type { Content } from '@/../@types/content'
import PParagraph from '@/components/content/PParagraph.vue'
import PImg from '@/components/content/PImg.vue'
import PMaterialEdit from '@/components/content/PMaterialEdit.vue'
const text = ref('114514')
const formula = ref('\\dfrac{114514}{1919810}')
const x = ref<Content[]>([])
const m = ref('2314')
const i = ref('')

const mat = ref<Content[]>([
  {
    type: 'text',
    content: '114514',
  }
])
const ori = ref('1919')
const lab = ref('810')

function upd(val: Event) {
  console.log((val.target as HTMLParagraphElement)?.innerText)
}
</script>

<template>
  <PTextEdit v-model="text" editable />
  <PFormulaEdit v-model="formula" editable />
  <PContentEditor v-model="x" />
  <p style="outline: none; font-family: 'Menlo'" contenteditable @input="upd" />
  1
  <PParagraph v-model="m" mode="area" />
  2
  <PImg v-model="i" />
  3
  <PMaterialEdit v-model="mat" v-model:label="lab" v-model:origin="ori" />
</template>
