<script setup lang="ts">
/* global defineProps */
// @ts-nocheck
import type { AnswerProblem, BlankProblem } from '@/../@types/problem'
import { toRefs } from 'vue'
import PProblem from './PProblem.vue'

const props = defineProps<{
  problems: BlankProblem['subProblems'] | AnswerProblem['subProblems']
  level: 0 | 1 // 0 为“．”，总序号；1 为“（）”，小题；2 为圈（如“①”），“圈1”、“圈2”．
  mode: 'display' | 'page'
}>()

const { problems, level } = toRefs(props)
</script>
<template>
  <div class="subproblem">
    <PProblem
      v-for="problem in problems"
      :key="problem.id"
      :problem="problem.problem"
      :mode="mode"
      :level="level + 1"
      :order="problem.id"
    />
  </div>
</template>
