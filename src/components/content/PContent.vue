<script setup lang="ts">
/* global defineProps */
import type { Content } from '@/../@types/content'
import PImage from './PImage.vue'
import PTable from './PTable.vue'
import PText from './PText.vue'
import { toRefs } from 'vue'
import PBlank from './PBlank.vue'
import PTextEdit from './PTextEdit.vue'
import PFormulaEdit from './PFormulaEdit.vue'
import PMaterial from './PMaterial.vue'
import { ElDivider } from 'element-plus'
import PProblem from '../problems/PProblem.vue'
import PArticle from './PArticle.vue'

const props = defineProps<{
  content: Content[]
  editable?: boolean
  answer?: boolean
  prompt?: boolean
  fontmode?: 'quote'
  english?: boolean
  fullItalic?: boolean
  title?: boolean
  author?: boolean
  science?: boolean
}>()

const {
  content,
  editable,
  answer,
  prompt,
  fontmode,
  english,
  fullItalic,
  science,
} = toRefs(props)

if (typeof content.value !== 'object') content.value = []

// split array with `divider` element

const contents = content.value.reduce(
  (acc, cur) => {
    if (cur.type === 'divider') {
      acc.push([])
    } else {
      acc[acc.length - 1].push(cur)
    }
    return acc
  },
  [[]] as Content[][]
)
</script>

<template>
  <slot name="prepend" />
  <span v-if="contents.length === 1">
    <span v-for="(item, idx) in content" :key="idx" class="content">
      <PTextEdit
        v-if="item.type === 'text'"
        :class="prompt ? 'quote' : ''"
        v-model="item.content"
        :editable="editable"
        :answer="answer"
        :fontmode="fontmode"
        :english="english"
        :italic="fullItalic"
        :prompt="prompt"
        :title="title"
        :author="author"
        :science="science"
      />
      <PText
        v-else-if="item.type === 'textarea'"
        :content="item.content"
        mode="area"
        :english="english"
        :science="science"
      />
      <PFormulaEdit
        v-else-if="item.type === 'formula'"
        v-model="item.content"
        :editable="editable"
        :answer="answer"
      />
      <PImage v-else-if="item.type === 'image'" :src="item.src" />
      <PTable
        v-else-if="item.type === 'table'"
        :content="item.content"
        :english="english"
      />
      <!-- eslint-disable-next-line no-irregular-whitespace -->
      <PBlank
        v-else-if="item.type === 'blank'"
        :content="item"
        :english="english"
      />
      <PMaterial
        v-else-if="item.type === 'material'"
        :material="item.material"
      />
      <ElDivider v-else-if="item.type === 'divider'" />
      <PProblem
        v-else-if="item.type === 'problem'"
        :problem="item.problem"
        mode="display"
        :level="0"
      />
      <PArticle v-else-if="item.type === 'article'" :article="item.article" />
    </span>
  </span>
  <div v-else>
    <div v-for="(ctns, id) in contents" :key="id">
      <span v-for="(item, idx) in ctns" :key="idx" class="content">
        <PTextEdit
          v-if="item.type === 'text'"
          :class="prompt ? 'quote' : ''"
          v-model="item.content"
          :editable="editable"
          :answer="answer"
          :fontmode="fontmode"
          :english="english"
          :italic="fullItalic"
          :prompt="prompt"
          :title="title"
          :author="author"
          :science="science"
        />
        <PText
          v-else-if="item.type === 'textarea'"
          :content="item.content"
          mode="area"
          :english="english"
          :science="science"
        />
        <PFormulaEdit
          v-else-if="item.type === 'formula'"
          v-model="item.content"
          :editable="editable"
          :answer="answer"
        />
        <PImage v-else-if="item.type === 'image'" :src="item.src" />
        <PTable
          v-else-if="item.type === 'table'"
          :content="item.content"
          :english="english"
        />
        <!-- eslint-disable-next-line no-irregular-whitespace -->
        <PBlank
          v-else-if="item.type === 'blank'"
          :content="item"
          :english="english"
        />
        <PMaterial
          v-else-if="item.type === 'material'"
          :material="item.material"
        />
        <ElDivider v-else-if="item.type === 'divider'" />
        <PProblem
          v-else-if="item.type === 'problem'"
          :problem="item.problem"
          mode="display"
          :level="0"
        />
        <PArticle v-else-if="item.type === 'article'" :article="item.article" />
      </span>
    </div>
  </div>
  <slot name="append" />
</template>
