<script lang="ts" setup>
/* global defineProps */
/* eslint-disable vue/valid-v-model */
import type {
  SingleChoiceProblem,
  MultipleChoiceProblem,
} from '@/../@types/problem'
import { ref, toRefs } from 'vue'
import {
  ElSpace,
  ElRadioGroup,
  ElRadio,
  ElCheckbox,
  ElCheckboxGroup,
} from 'element-plus'
import PContent from '../content/PContent.vue'
import { useStatusStore } from '@/stores/status'
import { getOrderText } from '@/utils/orderResult'

const status = useStatusStore()

const props = defineProps<{
  problem: SingleChoiceProblem | MultipleChoiceProblem
  type: 'display' | 'edit' | 'page'
  order?: number
  level: 0 | 1 | 2 // 0 为“．”，总序号；1 为“（）”，小题；2 为圈（如“①”），“圈1”、“圈2”．
}>()

const { problem, type, order, level } = toRefs(props)

const choices = new Array(26)
  .fill(0)
  .map((_, index) => String.fromCharCode(65 + index))

const answer = ref<number | number[] | null>([])

function atChange() {
  if (problem.value.type === 'single-choice') {
    answer.value = (problem.value as SingleChoiceProblem).answer
  } else if (problem.value.type === 'multiple-choice') {
    answer.value = (problem.value as MultipleChoiceProblem).answer
  }
}

atChange()

status.$subscribe(() => {
  if (!status.answer) answer.value = null
  else atChange()
})
</script>

<template>
  <div :style="{ fontSize: `${status.fontSize}px` }">
    <div v-if="type === 'display'" :class="level === 0 ? [] : ['pl-4']">
      <span class="origin">{{
        getOrderText({
          level: level as 0 | 1 | 2,
          index: order as number,
          origin: problem.origin,
        })
      }}</span>
      <PContent :content="problem.content" />
      <ElSpace
        v-if="status.type === 'preview'"
        wrap
        direction="horizontal"
        alignment="flex-start"
      >
        <ElRadioGroup
          v-if="problem.type === 'single-choice'"
          v-model="answer as number"
          class="pt-2 pl-4"
        >
          <ElRadio
            v-for="choice in problem.options"
            :key="choice.toString()"
            :label="choice.id"
            shadow="hover"
            border
            @change="atChange"
          >
            <PContent :content="choice.content" />
          </ElRadio>
        </ElRadioGroup>
        <ElCheckboxGroup
          v-else-if="problem.type === 'multiple-choice'"
          class="pt-2 pl-4"
          v-model="answer as number[]"
        >
          <ElCheckbox
            v-for="choice in problem.options"
            :key="choice.toString()"
            :label="choice.id"
            shadow="hover"
            border
            @change="atChange"
          >
            <PContent :content="choice.content" />
          </ElCheckbox>
        </ElCheckboxGroup>
      </ElSpace>
      <ElSpace
        v-if="status.type === 'print'"
        wrap
        direction="vertical"
        alignment="flex-start"
        class="pl-4"
      >
        <span
          v-for="choice in ((problem) as SingleChoiceProblem).options"
          :key="choice.toString()"
        >
          <span class="origin">{{ choices[choice.id] }}．</span>
          <PContent :content="choice.content" />
        </span>
      </ElSpace>
    </div>
  </div>
</template>
