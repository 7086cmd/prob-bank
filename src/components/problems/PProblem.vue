<script lang="ts" setup>
/* global defineProps */
import type {
  SingleChoiceProblem,
  MultipleChoiceProblem,
  Problem,
  BlankProblem,
  AnswerProblem,
} from '@/../@types/problem'
import { toRefs } from 'vue'
import { useStatusStore } from '@/stores/status'
import { ElButton, ElCard, ElDivider } from 'element-plus'
import PChoiceProblem from './PChoiceProblem.vue'
import PBlankProblem from './PBlankProblem.vue'
import PAnswerProblem from './PAnswerProblem.vue'
import { View, Download, Plus } from '@element-plus/icons-vue'

const status = useStatusStore()

const props = defineProps<{
  problem: Problem
  mode: 'display' | 'edit' | 'page'
  order?: number
  level: 0 | 1 | 2 // 0 为“．”，总序号；1 为“（）”，小题；2 为圈（如“①”），“圈1”、“圈2”．
}>()

const { problem, mode, order, level } = toRefs(props)
</script>

<template>
  <div class="pt-4">
    <ElCard
      v-if="mode === 'display' && status.type === 'preview'"
      shadow="hover"
    >
      <PChoiceProblem
        v-if="
          problem.type === 'single-choice' || problem.type === 'multiple-choice'
        "
        :type="mode"
        :problem="problem as (SingleChoiceProblem | MultipleChoiceProblem)"
        :order="order"
        :level="level"
      />
      <PBlankProblem
        v-else-if="problem.type === 'blank'"
        :type="mode"
        :problem="problem as (BlankProblem)"
        :order="order"
        :level="level"
      />
      <PAnswerProblem
        v-else-if="problem.type === 'answer'"
        :type="mode"
        :problem="problem as AnswerProblem"
        :order="order"
        :level="level"
      />
      <span v-else>没有这种类型的题目</span>
      <ElDivider v-if="level === 0" />
      <div v-if="level === 0" style="text-align: right">
        <ElButton size="small" text bg circle :icon="View" type="info" />
        <ElButton size="small" text bg circle :icon="Download" type="primary" />
        <ElButton size="small" text bg circle :icon="Plus" type="success" />
      </div>
    </ElCard>
    <div v-else-if="mode === 'display' && status.type === 'print'" style="px-4">
      <PChoiceProblem
        v-if="problem.type === 'single-choice' || problem.type === 'multiple-choice'"
        :type="mode"
        :problem="problem as (SingleChoiceProblem | MultipleChoiceProblem)"
        :order="order"
        :level="level"
      />
      <PBlankProblem
        v-else-if="problem.type === 'blank'"
        :type="mode"
        :problem="problem as (BlankProblem)"
        :order="order"
        :level="level"
      />
      <PAnswerProblem
        v-else-if="problem.type === 'answer'"
        :type="mode"
        :problem="problem as AnswerProblem"
        :order="order"
        :level="level"
      />
      <span v-else>没有这种类型的题目</span>
    </div>
  </div>
</template>
