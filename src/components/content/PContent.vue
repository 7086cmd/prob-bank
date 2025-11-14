<script setup lang="ts">
/* global defineProps */
import type { Content } from '@/../@types/content'
import { toRefs } from 'vue'
import ContentItem from './ContentItem.vue'

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
    <ContentItem
      v-for="(item, idx) in content"
      :key="idx"
      :item="item"
      :editable="editable"
      :answer="answer"
      :prompt="prompt"
      :fontmode="fontmode"
      :english="english"
      :full-italic="fullItalic"
      :title="title"
      :author="author"
      :science="science"
    />
  </span>
  <div v-else>
    <div v-for="(ctns, id) in contents" :key="id">
      <ContentItem
        v-for="(item, idx) in ctns"
        :key="idx"
        :item="item"
        :editable="editable"
        :answer="answer"
        :prompt="prompt"
        :fontmode="fontmode"
        :english="english"
        :full-italic="fullItalic"
        :title="title"
        :author="author"
        :science="science"
      />
    </div>
  </div>
  <slot name="append" />
</template>
