<script lang="ts" setup>
/* eslint-disable vue/valid-v-model */
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import type { AllProblem } from '@/../@types/problem'
import { useRoute, useRouter } from 'vue-router'
import { ElResult, ElCard } from 'element-plus'
import PCreateProblem from '@/components/problems/PCreateProblem.vue'
import { useStatusStore } from '@/stores/status'
import { getProblem } from '@/api'

const route = useRoute()
const router = useRouter()
const status = useStatusStore()

const id = route.params.id as string | undefined
const isEditMode = !!id

const loaded = ref(false)
const error = ref(false)
const errText = ref('')
const errCode = ref(200)
const mode = ref('default')

// Default problem template for insert mode
const defaultProblem: AllProblem = {
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
    level: ['S', 1],
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
}

const prob = ref<AllProblem>(defaultProblem)

onMounted(async () => {
  if (isEditMode) {
    // Modify mode: load existing problem
    try {
      const resp = await getProblem(id)
      if (resp) {
        prob.value = resp
        if (prob.value?.inGroup) {
          mode.value = 'group'
        }
        loaded.value = true
      } else {
        error.value = true
        errText.value = '获取题目失败'
        errCode.value = 404
      }
    } catch (err: any) {
      error.value = true
      errText.value = err.response?.data?.message || '加载失败'
      errCode.value = err.response?.data?.code || 500
    }
  } else {
    // Insert mode: use default problem
    loaded.value = true
  }
})
</script>

<template>
  <div>
    <transition leave-active-class="animate__animated animate__fadeOut">
      <div>
        <PCreateProblem
          v-if="loaded && status.type === 'preview'"
          v-model="prob"
          :level="0"
          :mode="(mode as 'default' | 'group')"
        />
        <div v-if="error" class="pt-2">
          <ElCard shadow="never">
            <ElResult
              icon="error"
              :title="`加载失败（${errCode}）`"
              :sub-title="errText"
            />
          </ElCard>
        </div>
      </div>
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
