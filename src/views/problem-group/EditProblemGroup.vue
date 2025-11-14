<script lang="ts" setup>
/* eslint-disable vue/valid-v-model */
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PCreateProblemGroup from '@/components/problem-group/PCreateProblemGroup.vue'
import type { ProblemGroup } from '@/../@types/problem-group'
import { ElNotification } from 'element-plus'
import { getProblemGroup } from '@/api'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const id = route.params.id as string | undefined
const isEditMode = !!id

const loaded = ref(false)

// Default problem group template for insert mode
const defaultProblemGroup: ProblemGroup = {
  _id: '',
  // @ts-ignore
  type: '',
  prompts: [],
  problems: [],
  data: {
    subject: '',
    origin: '',
    level: [undefined, undefined],
    difficulty: 0,
    referred: 0,
  },
  createAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
} as unknown as ProblemGroup

const problemGroup = ref<ProblemGroup>(defaultProblemGroup)

onMounted(async () => {
  if (isEditMode) {
    // Modify mode: load existing problem group
    try {
      const resp = await getProblemGroup(id)
      if (resp) {
        problemGroup.value = resp
        loaded.value = true
      } else {
        router.push('/problem-group/insert?_id=' + id)
        ElNotification({
          title: '题组不存在',
          type: 'error',
          message: '已经为您跳转到题组创建页面',
        })
      }
    } catch (error) {
      router.push('/problem-group/insert?_id=' + id)
      ElNotification({
        title: '题组加载失败',
        type: 'error',
        message: '已经为您跳转到题组创建页面',
      })
    }
  } else {
    // Insert mode: use default problem group
    loaded.value = true
  }
})
</script>

<template>
  <div v-loading="!loaded">
    <PCreateProblemGroup
      v-if="loaded"
      v-model="problemGroup"
      mode="insert"
    />
  </div>
</template>
