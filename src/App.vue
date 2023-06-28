<script lang="ts" setup>
import PProblem from '@/components/problems/PProblem.vue'
import type {
  SingleChoiceProblem,
  BlankProblem,
  AnswerProblem,
} from '@/../@types/problem'
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
import { Moon, Sunny, Setting, View, Hide } from '@element-plus/icons-vue'
import Dayjs from 'dayjs'
import { ref, watch } from 'vue'
import { useStatusStore } from './stores/status'
import PDisplayProblem from './components/problems/PDisplayProblem.vue'

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
                <ElButton type="info" text bg circle large :icon="Setting" />
                <ElButton
                  :type="status.answer ? 'danger' : 'success'"
                  text
                  bg
                  circle
                  large
                  :icon="status.answer ? Hide : View"
                  @click="status.toggleAnswer()"
                />
                <ElButton
                  v-if="status.type !== 'print'"
                  text
                  bg
                  circle
                  large
                  type="warning"
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
            <PDisplayProblem
              _id="649c14f48b8fbc301674ece9"
              mode="display"
              :order="1"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecea"
              mode="display"
              :order="2"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674eceb"
              mode="display"
              :order="3"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecec"
              mode="display"
              :order="4"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ece9"
              mode="display"
              :order="1"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecea"
              mode="display"
              :order="2"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674eceb"
              mode="display"
              :order="3"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecec"
              mode="display"
              :order="4"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ece9"
              mode="display"
              :order="1"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecea"
              mode="display"
              :order="2"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674eceb"
              mode="display"
              :order="3"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecec"
              mode="display"
              :order="4"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ece9"
              mode="display"
              :order="1"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecea"
              mode="display"
              :order="2"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674eceb"
              mode="display"
              :order="3"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecec"
              mode="display"
              :order="4"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ece9"
              mode="display"
              :order="1"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecea"
              mode="display"
              :order="2"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674eceb"
              mode="display"
              :order="3"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecec"
              mode="display"
              :order="4"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ece9"
              mode="display"
              :order="1"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecea"
              mode="display"
              :order="2"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674eceb"
              mode="display"
              :order="3"
            />
            <PDisplayProblem
              _id="649c14f48b8fbc301674ecec"
              mode="display"
              :order="4"
            />
          </ElScrollbar>
        </ElMain>
        <ElAside v-if="status.type === 'preview'" width="8%" />
      </ElContainer>
    </ElMain>
    <ElFooter></ElFooter>
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
  top: 0;
  left: 0;
  z-index: 16;
}
</style>
