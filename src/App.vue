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
  ElLoading,
  ElAffix,
  ElScrollbar,
} from 'element-plus'
import { InternalData } from '@icon-park/vue-next'
import { useDark, useWindowSize } from '@vueuse/core'
import { Moon, Sunny, Printer } from '@element-plus/icons-vue'
import Dayjs from 'dayjs'
import { ref, watch } from 'vue'
import { useStatusStore } from './stores/status'

const status = useStatusStore()

const darkmode = useDark()

function showSizeChange() {
  const loading = ElLoading.service({
    lock: true,
    text: `正在调整窗口尺寸：${width.value}×${height.value}`,
    background: '#efefef',
  })

  setTimeout(() => {
    loading.close()
  }, 1200)
}

const { width, height } = useWindowSize()

watch(width, () => {
  showSizeChange()
})

watch(height, () => {
  showSizeChange()
})

const tpColor = ref(darkmode.value ? '#141414' : '#ffffff')
const tpRadius = ref(darkmode.value ? '6px' : '4px')

watch(darkmode, () => {
  tpColor.value = darkmode.value ? '#141414' : '#ffffff'
  tpRadius.value = darkmode.value ? '6px' : '4px'
})

status.usePreview()

const pageBeforePrint = ref(false)
const answerBeforePrint = ref(false)

window.onbeforeprint = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在进入打印模式……',
    background: '#efefef',
  })
  pageBeforePrint.value = darkmode.value
  answerBeforePrint.value = status.answer
  if (status.answer) {
    status.toggleAnswer()
  }
  console.log('Before Print')
  darkmode.value = false
  status.usePrint()
  loading.close()
}

window.onafterprint = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在退出打印模式……',
    background: '#efefef',
  })
  status.usePreview()
  darkmode.value = pageBeforePrint.value
  if (answerBeforePrint.value !== status.answer) {
    status.toggleAnswer()
  }
  loading.close()
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

const prob4 = {
  _id: 'nb23T24',
  type: 'answer',
  origin: '2023 年宁波市中考真题',
  content: [
    { type: 'text', content: '如图1，锐角' },
    { type: 'formula', content: '\\triangle ABC' },
    { type: 'text', content: '内接于' },
    { type: 'formula', content: '\\odot O' },
    { type: 'text', content: '，' },
    { type: 'formula', content: 'D' },
    { type: 'text', content: '为' },
    { type: 'formula', content: 'BC' },
    { type: 'text', content: '的中点，连结' },
    { type: 'formula', content: 'AD' },
    { type: 'text', content: '并 延长交' },
    { type: 'formula', content: '\\odot O' },
    { type: 'text', content: '于点' },
    { type: 'formula', content: 'E' },
    { type: 'text', content: '，连结' },
    { type: 'formula', content: 'BE' },
    { type: 'text', content: '，' },
    { type: 'formula', content: 'CE' },
    { type: 'text', content: '，过' },
    { type: 'formula', content: 'C' },
    { type: 'text', content: '作' },
    { type: 'formula', content: 'AC' },
    { type: 'text', content: '的垂线交' },
    { type: 'formula', content: 'AE' },
    { type: 'text', content: '于点' },
    { type: 'formula', content: 'F' },
    { type: 'text', content: '，点' },
    { type: 'formula', content: 'G' },
    { type: 'text', content: '在' },
    { type: 'formula', content: 'AD' },
    { type: 'text', content: '上，连结' },
    { type: 'formula', content: 'BG' },
    { type: 'text', content: '，' },
    { type: 'formula', content: 'CG' },
    { type: 'text', content: '，若' },
    { type: 'formula', content: 'BC' },
    { type: 'text', content: '平分' },
    { type: 'formula', content: '\\angle EBG' },
    { type: 'text', content: '且' },
    { type: 'formula', content: '\\angle BCG=\\angle AFC' },
    { type: 'text', content: '．' },
    {
      type: 'image',
      src: 'https://img.jyeoo.net/quiz/images/svg/202306/421/fe8d3ba3.png',
    },
  ],
  subProblems: [
    {
      id: 1,
      problem: {
        _id: 'nb23T24-1',
        type: 'answer',
        origin: '2023 年宁波市中考真题',
        content: [
          { type: 'text', content: '求' },
          { type: 'formula', content: '\\angle BGC' },
          { type: 'text', content: '的度数．' },
        ],
      },
    },
    {
      id: 2,
      problem: {
        _id: 'nb23T24-2',
        type: 'answer',
        origin: '2023 年宁波市中考真题',
        content: [],
        subProblems: [
          {
            id: 1,
            problem: {
              _id: 'nb23T24-2-1',
              type: 'answer',
              origin: '2023 年宁波市中考真题',
              content: [
                { type: 'text', content: '求证：' },
                { type: 'formula', content: 'AF=BC' },
                { type: 'text', content: '；' },
              ],
            },
          },
          {
            id: 2,
            problem: {
              _id: 'nb23T24-2-2',
              type: 'answer',
              origin: '2023 年宁波市中考真题',
              content: [
                { type: 'text', content: '若' },
                { type: 'formula', content: 'AG=DF' },
                { type: 'text', content: '，求' },
                { type: 'formula', content: '\\tan\\angle GBC' },
                { type: 'text', content: '的值．' },
              ],
            },
          },
        ],
      },
    },
    {
      id: 3,
      problem: {
        _id: 'nb23T24-3',
        type: 'answer',
        origin: '2023 年宁波市中考真题',
        content: [
          { type: 'text', content: '如图2，当点' },
          { type: 'formula', content: 'O' },
          { type: 'text', content: '恰好在' },
          { type: 'formula', content: 'BG' },
          { type: 'text', content: '上且' },
          { type: 'formula', content: 'OG=1' },
          { type: 'text', content: '时，求' },
          { type: 'formula', content: 'AC' },
          { type: 'text', content: '的长．' },
        ],
      },
    },
  ],
}

const prob3 = {
  _id: 'nb23T23',
  type: 'answer',
  origin: '2023 年宁波市中考真题',
  content: [
    {
      type: 'text',
      content:
        '定义：有两个相邻的内角是直角，并且有两条邻边相等的四边形称为邻等四边形，相等两邻边的夹角称为邻等角．\n',
    },
    {
      type: 'image',
      src: 'https://img.jyeoo.net/quiz/images/svg/202306/428/876cd6d3.png',
    },
  ],
  subProblems: [
    {
      id: 1,
      problem: {
        _id: 'nb23T23-1',
        type: 'answer',
        origin: '2023 年宁波市中考真题',
        content: [
          { type: 'text', content: '如图1，在四边形' },
          { type: 'formula', content: 'ABCD' },
          { type: 'text', content: '中，' },
          { type: 'formula', content: 'AD\\parallel BC' },
          { type: 'text', content: '，' },
          { type: 'formula', content: '\\angle A=90°' },
          { type: 'text', content: '，对角线' },
          { type: 'formula', content: 'BD' },
          { type: 'text', content: '平分' },
          { type: 'formula', content: '\\angle ADC' },
          { type: 'text', content: '．求证：四边形' },
          { type: 'formula', content: 'ABCD' },
          { type: 'text', content: '为邻等四边形．' },
        ],
      },
    },
    {
      id: 2,
      problem: {
        _id: 'nb23T23-2',
        type: 'answer',
        origin: '2023 年宁波市中考真题',
        content: [
          { type: 'text', content: '如图2，在' },
          { type: 'formula', content: '6\\times 5' },
          { type: 'text', content: '的方格纸中，' },
          { type: 'formula', content: 'A' },
          { type: 'text', content: '，' },
          { type: 'formula', content: 'B' },
          { type: 'text', content: '，' },
          { type: 'formula', content: 'C' },
          { type: 'text', content: '三点均在格点上，若四边形' },
          { type: 'formula', content: 'ABCD' },
          { type: 'text', content: '是邻等四边形，请画出所有符合条件的格点' },
          { type: 'formula', content: 'D' },
          { type: 'text', content: '．' },
        ],
      },
    },
    {
      id: 3,
      problem: {
        _id: 'nb23T23-3',
        type: 'answer',
        origin: '2023 年宁波市中考真题',
        content: [
          { type: 'text', content: '如图3，四边形' },
          { type: 'formula', content: 'ABCD' },
          { type: 'text', content: '是邻等四边形，' },
          { type: 'formula', content: '\\angle DAB=\\angle ABC=90°' },
          { type: 'text', content: '，' },
          { type: 'formula', content: '\\angle BCD' },
          { type: 'text', content: '为邻等角，连结' },
          { type: 'formula', content: 'AC' },
          { type: 'text', content: '，过' },
          { type: 'formula', content: 'B' },
          { type: 'text', content: '作' },
          { type: 'formula', content: 'BE\\parallel AC' },
          { type: 'text', content: '交' },
          { type: 'formula', content: 'DA' },
          { type: 'text', content: '的延长线于点' },
          { type: 'formula', content: 'E' },
          { type: 'text', content: '．若' },
          { type: 'formula', content: 'AC=8' },
          { type: 'text', content: '，' },
          { type: 'formula', content: 'DE=10' },
          { type: 'text', content: '，求四边形' },
          { type: 'formula', content: 'EBCD' },
          { type: 'text', content: '的周长．' },
        ],
      },
    },
  ],
} as AnswerProblem

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
    {
      type: 'table',
      content: [
        [
          {
            content: [{ type: 'text', content: 'a' }],
            type: 'header',
          },
          {
            content: [{ type: 'text', content: 'b' }],
            type: 'header',
          },
        ],
        [
          {
            content: [{ type: 'text', content: 'c' }],
            type: 'cell',
          },
          {
            content: [{ type: 'text', content: 'd' }],
            type: 'cell',
          },
        ],
        [
          {
            content: [{ type: 'text', content: 'e' }],
            colspan: 2,
            type: 'cell',
          },
        ],
      ],
    },
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
  <ElContainer @contextmenu.prevent>
    <ElHeader :style="{ userSelect: 'none' }">
      <ElAffix>
        <div class="header">
          <br />
          <ElRow>
            <ElCol :span="status.type === 'print' ? 12 : 8">
              <span :style="{ fontSize: '18px', opacity: 1 }">
                <ElIcon><InternalData /></ElIcon>
                Problem Bank Export
                <span
                  v-if="status.type !== 'print'"
                  :style="{ fontSize: '10px' }"
                >
                  Created by Wu Chengyu
                </span>
              </span>
            </ElCol>
            <ElCol v-if="status.type !== 'print'" :span="10">
              <div :style="{ textAlign: 'center' }"></div>
            </ElCol>
            <ElCol :span="status.type === 'print' ? 12 : 6">
              <div :style="{ textAlign: 'right' }">
                <span
                  :style="{ fontSize: '12px' }"
                  v-if="status.type === 'print'"
                >
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
        </div>
      </ElAffix>
    </ElHeader>
    <ElMain class="pt-2 px-6">
      <ElContainer>
        <ElAside v-if="status.type === 'preview'" width="8%" />
        <ElMain>
          <ElScrollbar>
            <PProblem :problem="prob" mode="display" :order="1" :level="0" />
            <PProblem :problem="prob2" mode="display" :order="2" :level="0" />
            <PProblem :problem="prob3" mode="display" :order="3" :level="0" />
            <PProblem :problem="prob4" mode="display" :order="4" :level="0" />
          </ElScrollbar>
        </ElMain>
        <ElAside v-if="status.type === 'preview'" width="8%" />
      </ElContainer>
    </ElMain>
  </ElContainer>

  <div></div>
</template>

<style>
body {
  word-break: keep-all;
  scrollbar-width: none;
}

::-webkit-scrollbar {
  display: none;
}

.header {
  position: relative;
  height: 80px;
  background-image: radial-gradient(transparent 1px, v-bind(tpColor) 1px);
  background-size: v-bind(tpRadius) v-bind(tpRadius);
  backdrop-filter: saturate(50%) blur(v-bind(tpRadius));
  -webkit-backdrop-filter: saturate(50%) blur(v-bind(tpRadius));
  filter: grayscale(1);
  top: 0;
  left: 0;
  z-index: 16;
}
</style>
