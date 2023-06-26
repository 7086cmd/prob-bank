<script setup lang="ts">
/* global defineProps */
import type { Content } from '@/../@types/content'
import PImage from './PImage.vue'
import PLatex from './PLatex.vue'
import PTable from './PTable.vue'
import PText from './PText.vue'
import { ref, toRefs, type Ref } from 'vue'
// @ts-ignore
import { v4 } from 'uuid'
import PBlank from './PBlank.vue'

const props = defineProps<{
  content: Content[]
}>()

const { content } = toRefs<{
  content: Content[]
}>(props)

type ContentWithId = (Content) & {
  id: string
  type: 'text' | 'formula' | 'image' | 'table' | 'blank'
}

// 为每一个 item 生成一个随机的 uuid
const body = ref(
  // @ts-ignore
  content.value.map((item) => {
    return {
      id: v4() as string,
      ...item,
    }
  })
) as Ref<ContentWithId[]>

</script>

<template>
  <span v-for="item in body" :key="item.id" class="content">
    <PText v-if="item.type === 'text'" :content="item.content" />
    <PLatex v-else-if="item.type === 'formula'" :expression="item.content" />
    <PImage v-else-if="item.type === 'image'" :src="item.src" />
    <!-- @ts-ignore -->
    <PTable v-else-if="item.type === 'table'" :content="item.content" />
    <!-- eslint-disable-next-line no-irregular-whitespace -->
    <PBlank v-else-if="item.type === 'blank'" :content="item" />
  </span>
</template>
