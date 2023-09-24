<script lang="ts" setup>
/* global defineProps */
/* eslint-disable vue/valid-v-model */
/* eslint-disable no-irregular-whitespace */
import type { JudgeProblem } from '@/../@types/problem'
import { ref, toRefs, watch } from 'vue'
import { ElSwitch } from 'element-plus'
import PContent from '../content/PContent.vue'
import { useStatusStore } from '@/stores/status'
import { getOrderText } from '@/utils/orderResult'
import { useSettingsStore } from '@/stores/settings'
import { Check, Close } from '@element-plus/icons-vue'

const status = useStatusStore()
const settings = useSettingsStore()
const props = defineProps<{
  problem: JudgeProblem
  type: 'display' | 'edit' | 'page'
  order?: number
  level: 0 | 1 | 2 // 0 为“．”，总序号；1 为“（）”，小题；2 为圈（如“①”），“圈1”、“圈2”．
}>()

const { problem, type, order, level } = toRefs(props)
const { fontSize } = toRefs(status)

const last = problem.value.content[problem.value.content.length - 1]

const answer = problem.value.answer
const handling = ref(false)

status.$subscribe(() => {
  if (status.answer) {
    handling.value = true
    problem.value.answer = !answer
    setTimeout(() => {
      problem.value.answer = answer
      handling.value = false
    })
  }
})

watch(
  () => problem.value.answer,
  () => {
    if (!handling.value) {
      problem.value.answer = answer
    }
  },
  { deep: true, immediate: true }
)

if (
  settings.defaults.showQuote &&
  last.type === 'text' &&
  !last.content.endsWith('（　　）')
) {
  problem.value.content.push({
    type: 'text',
    content: '（　　）',
  })
} else if (!settings.defaults.showQuote) {
  problem.value.content = problem.value.content.map((x) => {
    if (x.type === 'text')
      return {
        ...x,
        content: x.content.replaceAll('（　　）', ''),
      }
    else return x
  })
}
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
      <PContent :content="problem.content">
        <template #prepend>
          <span class="prompt">判断：</span>
        </template>
        <template #append> </template>
      </PContent>
      <br />
      <Transition
        appear
        enter-active-class="animate__animated animate__fadeIn"
      >
        <ElSwitch
          v-if="status.type === 'preview' && status.answer"
          class="px-6"
          v-model="problem.answer"
          inactive-text="错误（F）"
          active-text="正确（T）"
          :active-action-icon="Check"
          :inactive-action-icon="Close"
          readonly
        />
      </Transition>
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

.prompt {
  font-family: 'Source Han Sans' !important;
  font-size: v-bind(fontSize + 'px');
}
</style>
