<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ElInput,
  ElButton,
  ElDivider,
  ElRow,
  ElCol,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElResult,
} from 'element-plus'
import { Right, Plus } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import type { AllProblem } from '@/../@types/problem'
import PDisplayProblem from '@/components/problems/PDisplayProblem.vue'
import { useStatusStore } from '@/stores/status'
import NProgress from 'nprogress'
import { getProblems } from '@/api'

const router = useRouter()
const status = useStatusStore()

const pId = ref('')
const range = ref(0)

const problemSet = ref<AllProblem[]>([])
const store = ref<AllProblem[]>([])

const origin_filter = ref('')
const subject_filter = ref<string[]>(['Math', 'Physics', 'Chemistry'])
const content_filter = ref('')

const show = ref(false)

watch(origin_filter, () => {
  show.value = false
  show.value = true
})

watch(subject_filter, () => {
  show.value = false
  show.value = true
})

watch(content_filter, () => {
  show.value = false
  setTimeout(() => {
    show.value = true
  }, 100)
})

watch(show, () => {
  range.value = 1
})

NProgress.start()

getProblems().then((resp) => {
  store.value = resp?.reverse() as AllProblem[]
  range.value = 1
})

watch(range, () => {
  problemSet.value = store.value
    ?.filter(
      (_) =>
        _.data.origin.includes(origin_filter.value) &&
        subject_filter.value.includes(_.data.subject)
    )
    .filter((_, id) => id <= range.value * 60 - 1) as AllProblem[]
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
          <ElCol :span="4">内容索引</ElCol>
          <ElCol :span="20">
            <ElInput v-model="content_filter" placeholder="请输入关键词" />
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
    <div v-if="problemSet.length !== 0">
      <div
        v-for="(item, index) in problemSet.filter(
          (x) =>
            x.data.origin.includes(origin_filter) &&
            subject_filter.includes(x.data.subject)
        )"
        :key="item._id"
      >
        <PDisplayProblem
          :_id="item._id"
          :order="index + 1"
          :level="0"
          :filter="content_filter"
          mode="display"
        />
      </div>
      <br />
      <ElButton
        class="full-width py-2"
        text
        bg
        type="success"
        v-if="range * 40 < store.length"
        @click="range++"
      >
        加载更多
      </ElButton>
    </div>
    <ElResult v-else icon="error">
      <template #title>
        <div class="text-2xl">暂无题目</div>
      </template>
      <template #subTitle>
        <div class="text-lg">请检查筛选条件</div>
      </template>
    </ElResult>
  </div>
</template>

<style scoped>
.full-width {
  width: 100%;
}
</style>
