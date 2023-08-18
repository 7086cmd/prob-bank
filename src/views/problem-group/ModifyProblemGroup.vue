<script lang="ts" setup>
/* eslint-disable vue/valid-v-model */
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PCreateProblemGroup from '@/components/problem-group/PCreateProblemGroup.vue'
import type { ProblemGroup } from '@/../@types/problem-group'
import { ElNotification } from 'element-plus'
import { getProblemGroup } from '@/api'

const router = useRouter()
const route = useRoute()

const id = route.params.id

const problemGroup = ref<ProblemGroup>()

const loaded = ref(false)

getProblemGroup(id as string).then(resp => {
  if (resp) {
    problemGroup.value = resp as ProblemGroup
    loaded.value = true
  } else {
    router.push('/problem-group/insert?_id=' + id)
    ElNotification({
      title: '题组不存在',
      type: 'error',
      message: '已经为您跳转到题组创建页面',
    })
  }
})
</script>

<template>
  <div v-loading="!loaded">
    <PCreateProblemGroup
      v-if="loaded && problemGroup"
      v-model="problemGroup"
      mode="insert"
    />
  </div>
</template>
