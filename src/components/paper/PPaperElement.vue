<script setup lang="ts">
/* global defineProps */
import type { Element } from '@/../@types/paper'
import { ref, toRef } from 'vue'
import PDisplayProblem from '../problems/PDisplayProblem.vue'
import PDisplayProblemGroup from '../problem-group/PDisplayProblemGroup.vue'
import { ElDivider } from 'element-plus'
import PContent from '../content/PContent.vue'
import { usePaperStore } from '@/stores/paper'

const paper = usePaperStore()

const props = defineProps<{
  element: Element
  index: number
}>()

const element = toRef(props, 'element')
const ord = ref(element.value.type.includes('problem') ? 0 : -1)

if (element.value.type.includes('problem')) {
  // @ts-ignore
  paper.getOrderItem(element.value.type, element.value._id).then((resp) => {
    ord.value = resp
  })
}

if (element.value.type === 'prompt') {
  element.value.description.push({
    type: 'text',
    content: `：本大题有 ${element.value.score.length} 道小题，共 ${element.value.score.reduce(
      (a, b) => a + b
    )} 分．`
  })
}
</script>

<template>
  <div v-if="ord !== 0">
    <PDisplayProblem
      v-if="element.type === 'problem'"
      :order="ord"
      mode="display"
      :level="0"
      in-paper
      :_id="element.content._id"
    />
    <PDisplayProblem
      v-else-if="element.type === 'problem-index'"
      :_id="element._id"
      :order="ord"
      mode="display"
      paper
    />
    <PDisplayProblemGroup
      v-else-if="element.type === 'problem-group'"
      :order="ord - 1"
      mode="display"
      paper
      :_id="element.content._id"
    />
    <PDisplayProblemGroup
      v-else-if="element.type === 'problem-group-index'"
      :_id="element._id"
      :order="ord - 1"
      mode="display"
      paper
    />
    <ElDivider v-if="element.type === 'divider'" />
    <PContent
      v-else-if="element.type === 'prompt'"
      :content="element.description"
    />
  </div>
</template>

<style>
@import '@/assets/font.css';
</style>
