<script lang="ts" setup>
/* global defineProps */
// @ts-nocheck
import type { BlankProblem } from '@/../@types/problem'
import { toRefs } from 'vue'
import PContent from '../content/PContent.vue'
import { useStatusStore } from '@/stores/status'
import { getOrderText } from '@/utils/orderResult'
import type { ImageContent } from '@/../@types/content'
import PSubProblem from './PSubProblem.vue'

const status = useStatusStore()

const props = defineProps<{
  problem: BlankProblem
  type: 'display' | 'edit' | 'page'
  order?: number
  level: 0 | 1 | 2 // 0 为“．”，总序号；1 为“（）”，小题；2 为圈（如“①”），“圈1”、“圈2”．
  preview?: boolean
}>()

const { problem, type, order, level, preview } = toRefs(props)
const { fontSize } = toRefs(status)

const last2 = problem.value.content.slice(-2)

if (
  last2[0].type === 'text' &&
  last2[0].content === '；' &&
  last2[1].type === 'text' &&
  last2[1].content === '．'
) {
  problem.value.content = problem.value.content.slice(0, -1)
}

if (
  ['Math', 'Physics', 'Chemistry'].includes(problem.value.data.subject)
) {
  problem.value.content.map((x) => {
    if (x.type === 'text') {
      x.content = x.content.replace(/\\frac/g, '\\dfrac').replaceAll('。', '．')
    }
  })
}
</script>

<template>
  <div :style="{ fontSize: `${status.fontSize}px` }">
    <div
      v-if="type === 'display' || type === 'page'"
      :class="level === 0 ? [] : ['pl-4']"
    >
      <span class="origin" v-if="type === 'display'"
        >{{
          getOrderText({
            level: level as 0 | 1 | 2,
            index: order as number,
            origin: '',
          })
        }}
        <span class="description" v-if="level === 0">
          （{{ problem.data.origin }}）
        </span>
      </span>
      <PContent
        v-if="status.dispMode !== 'answer'"
        :content="problem.content"
      />
      <br v-if="status.dispMode !== 'answer'" />
      <PContent
        v-if="problem.image && status.dispMode !== 'answer'"
        :content="[{ type: 'image', src: problem.image } as ImageContent]"
      />
      <PSubProblem
        v-if="!preview && status.dispMode !== 'answer'"
        :problems="problem.subProblems"
        mode="display"
        :level="level"
      />
    </div>
  </div>
</template>

<style scoped>
.description {
  font-family: '方正仿宋' !important;
  font-size: v-bind((fontSize + 1) + 'px');
}
</style>
