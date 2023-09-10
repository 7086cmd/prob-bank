<script lang="ts" setup>
/* eslint-disable vue/valid-v-model */
import { ref } from 'vue'
import dayjs from 'dayjs'
import type { AllProblem } from '@/../@types/problem'
import PCreateProblem from '@/components/problems/PCreateProblem.vue'
import { useStatusStore } from '@/stores/status'

const status = useStatusStore()

const prob = ref<AllProblem>({
  _id: '',
  type: 'single-choice',
  content: [],
  answer: 0,
  options: [],
  image: '',
  details: {
    analytical: '',
    procedure: [],
    comment: '',
    tags: [],
  },
  createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  data: {
    difficulty: 0,
    referred: 0,
    level: ['P', 0],
    subject: 'Others',
    origin: '',
  },
  subProblems: [],
  inGroup: '',
  wrong: {
    type: '',
    lesson: [],
    reason: []
  }
})
</script>

<template>
  <div>
    <transition leave-active-class="animate__animated animate__fadeOut">
      <PCreateProblem
        v-if="status.type === 'preview'"
        v-model="prob"
        :level="0"
        mode="default"
      />
    </transition>
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      appear
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div class="text-2xl" v-if="status.type === 'print'">
        该页面不支持打印，请转到详情页面。
      </div>
    </transition>
  </div>
</template>

<style scoped>
.animate__fadeOut {
  position: absolute;
}
</style>
