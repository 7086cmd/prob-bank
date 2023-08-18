<script setup lang="ts">
/* global defineProps */
import type { Content } from '@/../@types/content'
import PImage from './PImage.vue'
import PTable from './PTable.vue'
import PText from './PText.vue'
import { toRefs } from 'vue'
import PBlank from './PBlank.vue'
import PTextEdit from './PTextEdit.vue'
import PLatex from './PLatex.vue'
import PFormulaEdit from './PFormulaEdit.vue'
import PMaterial from './PMaterial.vue'

const props = defineProps<{
  content: Content[]
  editable?: boolean
  answer?: boolean
  prompt?: boolean
}>()

const { content, editable, answer, prompt } = toRefs(props)

if (typeof content.value !== 'object') content.value = []
</script>

<template>
  <span v-for="(item, idx) in content" :key="idx" class="content">
    <PTextEdit
      v-if="item.type === 'text'"
      :class="prompt ? 'quote' : ''"
      v-model="item.content"
      :editable="editable"
      :answer="answer"
    />
    <PText
      v-else-if="item.type === 'textarea'"
      :content="item.content"
      mode="area"
    />
    <PFormulaEdit
      v-else-if="item.type === 'formula'"
      v-model="item.content"
      :editable="editable"
      :answer="answer"
    />
    <PImage v-else-if="item.type === 'image'" :src="item.src" />
    <!-- @ts-ignore -->
    <PTable v-else-if="item.type === 'table'" :content="item.content" />
    <!-- eslint-disable-next-line no-irregular-whitespace -->
    <PBlank v-else-if="item.type === 'blank'" :content="item" />
    <PMaterial
      v-else-if="item.type === 'material'"
      :materials="item.materials"
    />
  </span>
</template>
