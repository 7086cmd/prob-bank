<script lang="ts" setup>
/* global defineProps */
import type { AnswerProblem } from '@/../@types/problem'
import { ref, toRefs } from 'vue'
import PContent from '../content/PContent.vue'
import { useStatusStore } from '@/stores/status'
import { getOrderText } from '@/utils/orderResult'
import PSubProblem from './PSubProblem.vue'
import type { ImageContent } from '@/../@types/content'
import { ElCol, ElRow } from 'element-plus'

const status = useStatusStore()

const props = defineProps<{
  problem: AnswerProblem
  type: 'display' | 'page'
  order?: number
  level: 0 | 1 // 0 为“．”，总序号；1 为“（）”，小题；2 为圈（如“①”），“圈1”、“圈2”．
  preview?: boolean
}>()

const { problem, type, order, level, preview } = toRefs(props)
const { fontSize } = toRefs(status)
const procedure = ref('')

function getProcedures(
  level: 0 | 1 | 2 = 0,
  obj: AnswerProblem = problem.value
): string {
  return obj.subProblems
    .map((item, i) => {
      return `${getOrderText({
        level: (level + 1) as 1 | 2,
        index: i + 1,
      })}${getProcedures((level + 1) as 1 | 2, item.problem as AnswerProblem)}`
    })
    .join('；<br />\n')
}

procedure.value = getProcedures()

const length = ref(Math.round(Math.random() * 8))

if (['Math', 'Physics', 'Chemistry'].includes(problem.value.data.subject)) {
  problem.value.content.map((x) => {
    if (x.type === 'text') {
      x.content = x.content.replace(/\\frac/g, '\\dfrac').replaceAll('。', '．')
    }
  })
}

if (length.value < 3) length.value = 3
</script>

<template>
  <div :style="{ fontSize: `${status.fontSize}px` }">
    <div
      v-if="type === 'display' || type === 'page'"
      :class="level === 0 ? [] : ['pl-4']"
    >
      <span class="origin order" v-if="type === 'display'"
        >{{
          getOrderText({
            level: level as 0 | 1 | 2,
            index: order as number,
            origin: problem.data.origin,
          })
        }}<span
          class="description"
          v-if="level === 0 && $route.name !== 'paper'"
          >（{{ problem.data.origin }}）</span
        ></span
      >
      <PContent
        v-if="status.dispMode !== 'answer'"
        :content="problem.content"
      />
      <br />
      <PContent
        v-if="problem.image && status.dispMode !== 'answer'"
        :content="[{ type: 'image', src: problem.image } as ImageContent]"
      />
      <PSubProblem
        v-if="status.dispMode !== 'answer' && !preview"
        :problems="(problem as AnswerProblem).subProblems"
        mode="display"
        :level="level"
      />
      <div
        v-if="
          status.answer &&
          (problem as AnswerProblem).answer.length !== 0 &&
          type === 'display'
        "
        class="answer"
      >
        <br />
        <ElRow>
          <ElCol :span="1"></ElCol>
          <ElCol :span="2">答案</ElCol>
          <ElCol :span="21"
            ><PContent :content="(problem as AnswerProblem).answer"
          /></ElCol>
        </ElRow>
      </div>
    </div>
    <div v-if="status.type === 'print' && status.dispMode === 'student'">
      <br v-for="i in length" :key="i" />
    </div>
  </div>
</template>

<style scoped>
.description {
  font-family: '方正仿宋' !important;
  font-size: v-bind((fontSize + 1) + 'px');
}

.order {
  font-family: 'Ubuntu', 'Source Han Serif' !important;
  font-size: v-bind(fontSize + 'px');
}
</style>
