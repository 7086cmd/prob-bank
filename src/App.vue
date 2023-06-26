<script lang="ts" setup>
import PProblem from '@/components/problems/PProblem.vue'
import type { SingleChoiceProblem, BlankProblem } from '@/../@types/problem'
import {
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElFooter,
  ElDivider,
  ElIcon,
  ElCol,
  ElRow,
  ElButton,
} from 'element-plus'
import { InternalData } from '@icon-park/vue-next'
import { useDark } from '@vueuse/core'
import { Moon, Sunny, Printer } from '@element-plus/icons-vue'
import Dayjs from 'dayjs'
import { ref } from 'vue'
import { useStatusStore } from './stores/status'

const status = useStatusStore()

const darkmode = useDark()

status.usePreview()

const pageBeforePrint = ref(false)
const answerBeforePrint = ref(false)

window.onbeforeprint = () => {
  pageBeforePrint.value = darkmode.value
  answerBeforePrint.value = status.answer
  if (status.answer) {
    status.toggleAnswer()
  }
  console.log('Before Print')
  darkmode.value = false
  status.usePrint()
}

window.onafterprint = () => {
  status.usePreview()
  darkmode.value = pageBeforePrint.value
  if (answerBeforePrint.value !== status.answer) {
    status.toggleAnswer()
  }
}

const prob = {
  _id: 'P1T10',
  type: 'single-choice',
  origin: '2024 年版本《高中必刷题》数学必修一 P1T10',
  content: [
    {
      type: 'text',
      content: '集合',
    },
    {
      type: 'formula',
      content:
        'A=\\left\\{ \\cfrac{6}{3-x}\\in \\mathbb{Z} \\mid x\\in \\mathbb{N} ^* \\right\\}',
    },
    {
      type: 'text',
      content: '，用列举法可表示为（　　）',
    },
    {
      type: 'text',
      content: '<br />',
    },
  ],
  difficulty: 0,
  tags: ['集合'],
  score: 5,
  level: ['S', 1],
  options: [
    {
      id: 0,
      content: [
        {
          type: 'formula',
          content: '\\left\\{3,6\\right\\}',
        },
      ],
    },
    {
      id: 1,
      content: [
        {
          type: 'formula',
          content: '\\left\\{1,2,4,5,6,9\\right\\}',
        },
      ],
    },
    {
      id: 2,
      content: [
        {
          type: 'formula',
          content: '\\left\\{-6,-3,-2,-1,3,6\\right\\}',
        },
      ],
    },
    {
      id: 3,
      content: [
        {
          type: 'formula',
          content: '\\left\\{-6,-3,-2,-1,2,3,6\\right\\}',
        },
      ],
    },
  ],
  answer: 1,
} as SingleChoiceProblem

const prob2 = {
  _id: 'P2T15',
  type: 'blank',
  origin: '2024 年版本《高中必刷题》数学必修一 P2T15',
  content: [
    { type: 'text', content: '已知集合' },
    { type: 'formula', content: 'A=\\left\\{x\\mid ax^2-3x+1=0\\right\\}' },
    { type: 'text', content: '，其中' },
    { type: 'formula', content: 'a' },
    { type: 'text', content: '为常数，且' },
    { type: 'formula', content: 'a\\in \\mathbb{R}' },
    { type: 'text', content: '．若' },
    { type: 'formula', content: 'A' },
    { type: 'text', content: '中至多有一个元素，则实数' },
    { type: 'formula', content: 'a' },
    { type: 'text', content: '的取值范围为' },
    {
      type: 'blank',
      answer: [
        {
          type: 'formula',
          content:
            '\\left\\{a\\mid a\\geqslant\\cfrac94 \\text{或} a=0\\right\\}',
        },
      ],
    },
    { type: 'text', content: '．' },
  ],
  difficulty: 0,
  tags: ['集合'],
  score: 5,
  level: ['S', 1],
} as BlankProblem

function print() {
  window.print()
}

const date = ref(Dayjs().format('YYYY年MM月DD日 HH:mm:ss'))

setInterval(() => {
  date.value = Dayjs().format('YYYY年MM月DD日 HH:mm:ss')
}, 100)
</script>

<template>
  <ElContainer>
    <ElHeader :style="{ userSelect: 'none' }">
      <br />
      <ElRow>
        <ElCol :span="status.type === 'print' ? 12 : 8">
          <span :style="{ fontSize: '18px' }">
            <ElIcon><InternalData /></ElIcon>
            Problem Bank Export
            <span v-if="status.type !== 'print'" :style="{ fontSize: '10px' }">
              Created by Wu Chengyu
            </span>
          </span>
        </ElCol>
        <ElCol v-if="status.type !== 'print'" :span="10">
          <div :style="{ textAlign: 'center' }"></div>
        </ElCol>
        <ElCol :span="status.type === 'print' ? 12 : 6">
          <div :style="{ textAlign: 'right' }">
            <span :style="{ fontSize: '12px' }" v-if="status.type === 'print'">
              {{ date }}
            </span>
            <ElButton
              v-if="status.type !== 'print'"
              text
              bg
              circle
              large
              :icon="Printer"
              :disabled="darkmode"
              @click="print"
            />
            <ElButton
              v-if="status.type !== 'print'"
              text
              bg
              circle
              large
              :icon="darkmode ? Sunny : Moon"
              @click="darkmode = !darkmode"
            />
          </div>
        </ElCol>
      </ElRow>
      <ElDivider />
    </ElHeader>
    <ElMain class="pt-2 px-6">
      <ElContainer>
        <ElAside v-if="status.type === 'preview'" width="8%" />
        <ElMain>
          <PProblem :problem="prob" mode="display" :order="1" :level="0" />
          <PProblem :problem="prob2" mode="display" :order="2" :level="0" />
        </ElMain>
        <ElAside v-if="status.type === 'preview'" width="8%" />
      </ElContainer>
    </ElMain>
  </ElContainer>

  <div></div>
</template>
