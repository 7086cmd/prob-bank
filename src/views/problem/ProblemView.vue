<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ElInput,
  ElButton,
  ElDivider,
  ElRow,
  ElCol,
  ElNotification,
  ElCheckboxButton,
  ElCheckboxGroup,
} from 'element-plus'
import { Right, Plus } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import type { AllProblem } from '@/../@types/problem'
import PProblem from '@/components/problems/PProblem.vue'
import { useStatusStore } from '@/stores/status'
import NProgress from 'nprogress'

const router = useRouter()
const status = useStatusStore()

const pId = ref('')

const problemSet = ref<AllProblem[]>([])

NProgress.start()

window.probbank
  .request({
    pathname: 'problem',
    method: 'get',
    request: {
      params: {
        _id: 'all',
      },
    },
  })
  .then((resp) => {
    NProgress.done()
    show.value = true
    console.log(resp)
    if (resp.status === 'success') problemSet.value = resp.data as AllProblem[]
    else
      ElNotification({
        title: '获取题目列表失败',
        message: resp.message,
        type: 'error',
      })
  })

const subjects = [
  {
    value: 'Chinese',
    label: '语文',
  },
  {
    value: 'Math',
    label: '数学',
  },
  {
    value: 'English',
    label: '英语',
  },
  {
    value: 'Physics',
    label: '物理',
  },
  {
    value: 'Chemistry',
    label: '化学',
  },
  {
    value: 'Biology',
    label: '生物',
  },
  {
    value: 'Politics',
    label: '政治',
  },
  {
    value: 'History',
    label: '历史',
  },
  {
    value: 'Geography',
    label: '地理',
  },
  {
    value: 'IT',
    label: '信息技术',
  },
  {
    value: 'General Technology',
    label: '通用技术',
  },
  {
    value: 'Others',
    label: '其他',
  },
]

const origin_filter = ref('')
const subject_filter = ref<string[]>(['Math', 'Physics', 'Chemistry'])

const show = ref(false)

watch(origin_filter, () => {
  show.value = false
  show.value = true
})

watch(subject_filter, () => {
  show.value = false
  show.value = true
  console.log(
    problemSet.value.filter(
      (x) =>
        x.data.origin.includes(origin_filter.value) &&
        subject_filter.value.includes(x.data.subject)
    )
  )
})
</script>

<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInLeft"
      appear
    >
      <div>
        <span v-if="status.type === 'preview'" class="text-2xl">
          题目索引页
        </span>
        <ElDivider v-if="status.type === 'preview'" />
      </div>
    </transition>
    <transition
      enter-active-class="animate__animated animate__fadeInRight"
      appear
    >
      <div>
        <ElRow class="py-2">
          <ElCol :span="4">来源索引</ElCol>
          <ElCol :span="20">
            <ElInput v-model="origin_filter" placeholder="请输入关键词" />
          </ElCol>
        </ElRow>
        <ElRow class="py-2">
          <ElCol :span="4">科目索引</ElCol>
          <ElCol :span="18">
            <ElCheckboxGroup v-model="subject_filter">
              <ElCheckboxButton
                v-for="item in subjects"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </ElCheckboxButton>
            </ElCheckboxGroup>
          </ElCol>
          <ElCol :span="2">
            <div v-if="status.type === 'preview'" style="text-align: right">
              <ElButton
                type="success"
                text
                bg
                circle
                :icon="Plus"
                @click="() => router.push('/problem/insert')"
              />
            </div>
          </ElCol>
        </ElRow>
        <ElDivider v-if="status.type === 'preview'" />
      </div>
    </transition>
    <transition enter-active-class="animate__animated animate__fadeInUp" appear>
      <ElRow v-if="status.type === 'preview'">
        <ElCol :span="23">
          <ElInput
            v-model="pId"
            placeholder="请输入题目 ID"
            @keyup.enter="() => router.push(`/problem/display/${pId}`)"
          />
        </ElCol>
        <ElCol :span="1">
          <div style="text-align: right">
            <ElButton
              type="primary"
              text
              bg
              circle
              :icon="Right"
              @click="() => router.push(`/problem/display/${pId}`)"
            />
          </div>
        </ElCol>
      </ElRow>
    </transition>

    <ElDivider v-if="status.type === 'preview'" />
    <div v-if="show">
      <div
        v-for="(item, index) in problemSet.filter(
          (x) =>
            x.data.origin.includes(origin_filter) &&
            subject_filter.includes(x.data.subject)
        )"
        :key="item._id"
      >
        <PProblem
          :problem="item"
          :_id="item._id"
          :order="index + 1"
          :level="0"
          mode="display"
        />
      </div>
    </div>
  </div>
</template>
