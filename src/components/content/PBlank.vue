<script lang="ts" setup>
/* global defineProps */
/* eslint-disable no-irregular-whitespace */
import PContent from './PContent.vue'
import { useStatusStore } from '@/stores/status'
const status = useStatusStore()
import type { BlankContent, Content } from '@/../@types/content'
import { toRefs } from 'vue'

const props = defineProps<{
  content: BlankContent
}>()

const { content } = toRefs(props)

function useLength(str: Content[]) {
  let length = 0
  str.forEach((ctn) => {
    if (ctn.type === 'text') {
      length += ctn.content.length
    } else if (ctn.type === 'formula') {
      length += Math.ceil(ctn.content.length / 3)
    }
  })
  if (length <= 9) return 6
  return Math.ceil((length / 3) * 2)
}

content.value.answer.map((ctn) => {
  if (ctn.type === 'text') {
    ctn.content = ctn.content.replace(/\s/g, '　')
  }
  if (ctn.type === 'formula') {
    ctn.content = ctn.content.replace(/\\frac/g, '\\cfrac')
    if (!ctn.content.startsWith('\\underline{'))
      ctn.content = `\\underline{${ctn.content}}`
  }
})
</script>

<template>
  <span class="blank">
    <u>
      <PContent
        v-if="status.answer"
        :content="(content as BlankContent).answer"
        answer
      />
      <span v-else>
        <span v-for="i in useLength((content as BlankContent).answer)" :key="i"
          >　</span
        >
      </span>
    </u>
  </span>
</template>

<style scoped>
.blank {
  word-break: keep-all;
}
</style>
