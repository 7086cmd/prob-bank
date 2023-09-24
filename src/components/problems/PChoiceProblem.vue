<script lang="ts" setup>
/* global defineProps */
/* eslint-disable vue/valid-v-model */
/* eslint-disable no-irregular-whitespace */
import type {
  SingleChoiceProblem,
  MultipleChoiceProblem,
} from '@/../@types/problem'
import { readonly, ref, toRefs, unref } from 'vue'
import { ElRadio, ElCheckbox, ElRow, ElCol, ElCard } from 'element-plus'
import PContent from '../content/PContent.vue'
import { useStatusStore } from '@/stores/status'
import { getOrderText } from '@/utils/orderResult'
import type { Content, ImageContent, TextContent } from '@/../@types/content'
import { useWindowSize } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'

const status = useStatusStore()
const size = useWindowSize()
const settings = useSettingsStore()

const props = defineProps<{
  problem: SingleChoiceProblem | MultipleChoiceProblem
  type: 'display' | 'edit' | 'page'
  order?: number
  level: 0 | 1 | 2 // 0 为“．”，总序号；1 为“（）”，小题；2 为圈（如“①”），“圈1”、“圈2”．
}>()

const { problem, type, order, level } = toRefs(props)
const { fontSize } = toRefs(status)

settings.$subscribe(() => {
  if (settings.defaults.showQuote) {
    const idx = problem.value.content.findLastIndex((x) => x.type === 'text')
    if (problem.value.content[idx].type === 'text') {
      if (
        !(problem.value.content[idx] as TextContent).content.endsWith(
          '（　　）'
        )
      ) {
        (problem.value.content[idx] as TextContent).content += '（　　）'
      }
    }
  }
})

console.log('Show Quote', settings.defaults.showQuote)

if (settings.defaults.showQuote) {
  console.log('Use It')
  const idx = problem.value.content.findLastIndex((x) => x.type === 'text')
  if (problem.value.content[idx].type === 'text') {
    if (
      !(problem.value.content[idx] as TextContent).content.endsWith('（　　）')
    ) {
      (problem.value.content[idx] as TextContent).content += '（　　）'
    }
  }
}

const choices = new Array(26)
  .fill(0)
  .map((_, index) => String.fromCharCode(65 + index))

const answer = ref<number | number[] | null>([])

function atChange() {
  if (problem.value.type === 'single-choice') {
    if (!status.answer) answer.value = null
    answer.value = (problem.value as SingleChoiceProblem).answer
  } else if (problem.value.type === 'multiple-choice') {
    if (!status.answer) answer.value = null
    answer.value = (problem.value as MultipleChoiceProblem).answer
  }
}

atChange()

status.$subscribe(() => {
  if (!status.answer) answer.value = null
  else atChange()
})

const optionsDisplay = ref<
  {
    span: number
    isTrue: Readonly<{ value: boolean }>
  }[]
>([])

function useAnswer() {
  while (optionsDisplay.value.length) optionsDisplay.value.pop()
  // relys on the options.
  const options = problem.value.options
  let span = 6
  options.forEach((option) => {
    let length = 0
    option.content.forEach((content) => {
      if (content.type === 'formula') {
        length +=
          content.content
            .replaceAll('\\left', '')
            .replaceAll('\\right', '')
            .replaceAll('\\text', '')
            .replaceAll('\\dfrac', '')
            .replaceAll('\\complement', 'C')
            .replaceAll('\\leqslant', '<')
            .replaceAll('\\geqslant', '>')
            .replaceAll('\\', '').length / 2.4
      } else if (content.type === 'text') {
        length += content.content.length / 1.2
      } else if (content.type === 'image') {
        const img = new Image()
        img.src = content.src
        length += img.width / 10
      }
    })
    if (length * 12 > (size.width.value * 0.2) / 2) {
      span = 24
    } else if (length * 12 > (size.width.value * 0.2) / 4) {
      span = 12
    }
    if (type.value === 'page') {
      span = 24
    }
    optionsDisplay.value.push({
      span,
      isTrue: readonly({
        value: (() => {
          if (!status.answer) return false
          if (problem.value.type === 'single-choice') {
            return option.id === (problem.value as SingleChoiceProblem).answer
          } else if (problem.value.type === 'multiple-choice') {
            return (problem.value as MultipleChoiceProblem).answer.includes(
              option.id
            )
          } else {
            return false
          }
        })(),
      }),
    })
    const spans = optionsDisplay.value.map((option) => option.span)
    // Find the biggest
    const maxSpan = spans.reduce((a, b) => Math.max(a, b))
    optionsDisplay.value.map((x) => {
      x.span = maxSpan
    })
  })
}

useAnswer()

status.$subscribe(() => {
  useAnswer()
})
</script>

<template>
  <div :style="{ fontSize: `${status.fontSize}px` }">
    <div :class="level === 0 ? [] : ['pl-4']">
      <span v-if="type === 'display'" class="origin order"
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
        >
      </span>
      <!-- If Multiple -->
      <span class="origin description">
        {{
          problem.type === 'multiple-choice' && problem.answer.length > 1
            ? '（多选）'
            : ''
        }}
      </span>
      <!-- Content Of The Problem -->
      <PContent :content="problem.content" />
      <br />
      <PContent
        v-if="problem.image"
        :content="[{ type: 'image', src: problem.image } as ImageContent]"
      />
      <ElRow v-if="status.type === 'preview'">
        <ElCol
          :span="optionsDisplay[idx].span"
          v-for="(choice, idx) in problem.options"
          :key="idx"
          class="px-1 py-1"
        >
          <ElCard shadow="hover">
            <ElRadio
              v-if="problem.type === 'single-choice'"
              v-model="optionsDisplay[idx].isTrue.value"
              :label="true"
              border
            >
              {{ choices[choice.id] }}
            </ElRadio>
            <ElCheckbox
              v-if="problem.type === 'multiple-choice'"
              v-model="optionsDisplay[idx].isTrue.value"
              :label="true"
              border
            >
              {{ choices[choice.id] }}
            </ElCheckbox>
            <span v-if="problem.type === 'multiple-choice'">　　</span>
            <PContent
              :class="[problem.type === 'multiple-choice' ? 'px-8' : 'px-1']"
              :content="choice.content"
            />
          </ElCard>
        </ElCol>
      </ElRow>
      <ElRow v-if="status.type === 'print'" class="pl-6">
        <ElCol
          :span="optionsDisplay[idx].span"
          v-for="(choice, idx) in problem.options"
          :key="idx"
          class="px-1 py-1"
        >
          <div>
            {{ choices[choice.id] }}．<PContent
              class="px-1"
              :content="choice.content"
            />
          </div>
        </ElCol>
      </ElRow>
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
